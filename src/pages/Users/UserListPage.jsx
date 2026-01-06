// src/pages/Users/UserListPage.jsx
import { useEffect, useMemo, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Link, useNavigate } from "react-router-dom";

import api from "../../services/api"; // GET /api/profiles
import {
    fetchUsers,
    exportUsersCsv,
    activateUser,
    deactivateUser,
    updateUser,
} from "../../services/UserService.js";

import {
    unwrapList,
    normalizeUser,
    normalizeProfile,
    buildProfileMaps,
    resolveProfileCodeAndId,
} from "./userListUtils";

import { buildUserListColumns } from "./userListColumns";

export default function UserListPage() {
    const navigate = useNavigate();

    const [rows, setRows] = useState([]);
    const [profiles, setProfiles] = useState([]);

    const [loading, setLoading] = useState(false);
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });

    // Controle de edição inline (1 linha por vez)
    const [editingId, setEditingId] = useState(null);

    // Form guarda profileCode (select) + idProfile (PUT)
    const [editForm, setEditForm] = useState({
        name: "",
        email: "",
        jobTitle: "",
        profileCode: "", // ADMIN | GESTOR_TI | ANALISTA_TI | USUARIO
        idProfile: null, // number
    });

    // Maps de perfis
    const { profileByCode, profileById } = useMemo(
        () => buildProfileMaps(profiles),
        [profiles]
    );

    // -----------------------------
    // Loads
    // -----------------------------
    const loadUsers = async () => {
        const list = await fetchUsers({ page: 0, size: 100 });
        const normalized = (Array.isArray(list) ? list : []).map(normalizeUser);
        setRows(normalized);
    };

    const loadProfiles = async () => {
        try {
            const res = await api.get("/api/profiles");
            const list = unwrapList(res.data).map(normalizeProfile);
            setProfiles(list);
            return;
        } catch (e1) {
            try {
                const res = await api.get("/api/profiles/");
                const list = unwrapList(res.data).map(normalizeProfile);
                setProfiles(list);
            } catch (e2) {
                console.warn("Não foi possível carregar perfis em /api/profiles", e2);
                setProfiles([]);
            }
        }
    };

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                await Promise.all([loadProfiles(), loadUsers()]);
            } catch (err) {
                const status = err?.response?.status;

                // UX: se não tiver permissão, redireciona sem alert
                if (status === 403) {
                    navigate("/dashboard", { replace: true });
                    return;
                }

                console.error(err);
                alert("Falha ao carregar dados. Verifique o servidor e tente novamente.");
            } finally {
                setLoading(false);
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigate]);

    // -----------------------------
    // Ações Ativar/Inativar
    // -----------------------------
    const handleActivate = async (id) => {
        try {
            setLoading(true);
            await activateUser(id);
            await loadUsers();
        } catch (err) {
            console.error("Falha ao ativar usuário", err);
            alert("Falha ao ativar usuário. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeactivate = async (id) => {
        try {
            setLoading(true);
            await deactivateUser(id);
            await loadUsers();
        } catch (err) {
            console.error("Falha ao inativar usuário", err);
            alert("Falha ao inativar usuário. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    // -----------------------------
    // Edição Inline
    // -----------------------------
    const handleStartEdit = (row) => {
        const { code, idProfile } = resolveProfileCodeAndId(row, {
            profiles,
            profileById,
            profileByCode,
        });

        setEditingId(row.id);
        setEditForm({
            name: row?.name ?? "",
            email: row?.email ?? "",
            jobTitle: row?.jobTitle ?? "",
            profileCode: code ?? "",
            idProfile: idProfile ?? null,
        });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditForm({ name: "", email: "", jobTitle: "", profileCode: "", idProfile: null });
    };

    const handleSaveEdit = async () => {
        if (!editingId) return;

        if (!editForm.idProfile) {
            alert("Selecione um Perfil (idProfile é obrigatório no backend).");
            return;
        }

        const currentRow = rows.find((r) => r.id === editingId);

        const payload = {
            name: String(editForm.name ?? "").trim(),
            email: String(editForm.email ?? "").trim(),
            jobTitle: editForm.jobTitle ?? "",
            idProfile: Number(editForm.idProfile),
            // evita 400 caso o backend exija 'ativo'
            ativo: currentRow?.ativo ?? true,
        };

        try {
            setLoading(true);
            await updateUser(editingId, payload);
            await loadUsers();
            handleCancelEdit();
        } catch (err) {
            const status = err?.response?.status;
            console.error("Falha ao salvar edição", err);

            if (status === 400) {
                alert(
                    "Falha ao salvar usuário (400). Verifique validações do backend (ex.: ativo/idProfile obrigatório)."
                );
            } else if (status === 401 || status === 403) {
                alert("Sessão inválida/sem permissão. Faça login novamente.");
            } else {
                alert("Falha ao salvar usuário. Verifique o backend e tente novamente.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async () => {
        try {
            await exportUsersCsv();
        } catch (e) {
            console.error(e);
            alert("Falha ao exportar. Faça login novamente.");
        }
    };

    // -----------------------------
    // Columns (agora fora do arquivo)
    // -----------------------------
    const columns = useMemo(() => {
        return buildUserListColumns({
            editingId,
            editForm,
            setEditForm,
            loading,
            profiles,
            profileByCode,
            profileById,
            onStartEdit: handleStartEdit,
            onSaveEdit: handleSaveEdit,
            onCancelEdit: handleCancelEdit,
            onActivate: handleActivate,
            onDeactivate: handleDeactivate,
        });
    }, [editingId, editForm, loading, profiles, profileByCode, profileById, rows]);

    return (
        <>
            <div className="panel">
                <h1>Usuários do Sistema</h1>
                <p>Visualize os usuários cadastrados e exporte a lista em CSV.</p>
            </div>

            <div className="panel">
                <div className="panel-header">
                    <h2>Usuários cadastrados</h2>

                    <div style={{ display: "flex", gap: 10 }}>
                        <Link className="btn-secondary" to="/users/new">
                            Novo Usuário
                        </Link>

                        <button className="btn-primary" type="button" onClick={handleExport} disabled={loading}>
                            Exportar CSV
                        </button>
                    </div>
                </div>

                <div className="users-grid" style={{ height: 420, width: "100%" }}>
                    <DataGrid
                        className="users-datagrid"
                        rows={rows}
                        columns={columns}
                        loading={loading}
                        getRowId={(row) => row.id}
                        disableRowSelectionOnClick
                        pagination
                        paginationModel={paginationModel}
                        onPaginationModelChange={setPaginationModel}
                        pageSizeOptions={[10, 25, 50]}
                        localeText={{
                            MuiTablePagination: {
                                labelRowsPerPage: "Linhas por página:",
                                labelDisplayedRows: ({ from, to, count }) => {
                                    const pad2 = (n) => String(n).padStart(2, "0");
                                    const total = count === -1 ? to : count;
                                    return `${pad2(from)}–${pad2(to)} de ${total}`;
                                },
                            },
                        }}
                    />
                </div>

                {editingId && (
                    <div style={{ marginTop: 10, opacity: 0.8, fontSize: 12 }}>
                        Edição inline ativa (ID: {editingId}). Para salvar, o backend exige <b>idProfile</b>.
                    </div>
                )}
            </div>
        </>
    );
}
