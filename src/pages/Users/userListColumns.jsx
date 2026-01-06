// src/pages/Users/userListColumns.jsx
import { actionsWrap, inputStyle, selectStyle, actionBtnStyle, stopGridKeyDown } from "./userListUi";
import { getStatusLabel, getProfileCodeForRow } from "./userListUtils";

export function buildUserListColumns({
                                         editingId,
                                         editForm,
                                         setEditForm,
                                         loading,
                                         profiles,
                                         profileByCode,
                                         profileById,
                                         onStartEdit,
                                         onSaveEdit,
                                         onCancelEdit,
                                         onActivate,
                                         onDeactivate,
                                     }) {
    return [
        { field: "id", headerName: "ID", width: 80 },

        {
            field: "name",
            headerName: "Nome",
            flex: 1,
            renderCell: (params) => {
                const row = params.row;
                const isEditing = row.id === editingId;
                if (!isEditing) return row.name;

                return (
                    <input
                        style={inputStyle}
                        value={editForm.name}
                        onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                        onKeyDown={stopGridKeyDown}
                        onKeyUp={stopGridKeyDown}
                        placeholder="Nome"
                    />
                );
            },
        },

        {
            field: "email",
            headerName: "E-mail",
            flex: 1.2,
            renderCell: (params) => {
                const row = params.row;
                const isEditing = row.id === editingId;
                if (!isEditing) return row.email;

                return (
                    <input
                        style={inputStyle}
                        value={editForm.email}
                        onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))}
                        onKeyDown={stopGridKeyDown}
                        onKeyUp={stopGridKeyDown}
                        placeholder="E-mail"
                    />
                );
            },
        },

        {
            field: "jobTitle",
            headerName: "Cargo (jobTitle)",
            flex: 1,
            renderCell: (params) => {
                const row = params.row;
                const isEditing = row.id === editingId;
                if (!isEditing) return row.jobTitle || "";

                return (
                    <input
                        style={inputStyle}
                        value={editForm.jobTitle}
                        onChange={(e) => setEditForm((f) => ({ ...f, jobTitle: e.target.value }))}
                        onKeyDown={stopGridKeyDown}
                        onKeyUp={stopGridKeyDown}
                        placeholder="Cargo"
                    />
                );
            },
        },

        {
            field: "profile",
            headerName: "Perfil",
            flex: 0.9,
            renderCell: (params) => {
                const row = params.row;
                const isEditing = row.id === editingId;

                if (!isEditing) {
                    return getProfileCodeForRow(row, { profiles, profileById });
                }

                return (
                    <select
                        style={selectStyle}
                        value={editForm.profileCode}
                        onChange={(e) => {
                            const code = String(e.target.value || "").toUpperCase();
                            const idProfile = profileByCode.get(code)?.idProfile ?? null;
                            setEditForm((f) => ({ ...f, profileCode: code, idProfile }));
                        }}
                        onKeyDown={stopGridKeyDown}
                        onKeyUp={stopGridKeyDown}
                        title="Selecione o perfil"
                    >
                        <option value="">Selecione...</option>
                        {profiles.map((p) => (
                            <option key={p.idProfile} value={p.code}>
                                {p.code}
                            </option>
                        ))}
                    </select>
                );
            },
        },

        {
            field: "status",
            headerName: "Status",
            width: 120,
            valueGetter: (_value, row) => getStatusLabel(row),
        },

        {
            field: "acoes",
            headerName: "Ações",
            width: 320,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            renderCell: (params) => {
                const row = params.row;
                const isAtivo = Boolean(row?.ativo);
                const isEditing = row.id === editingId;

                if (isEditing) {
                    return (
                        <div style={actionsWrap}>
                            <button
                                type="button"
                                className="btn-primary"
                                style={actionBtnStyle}
                                onClick={onSaveEdit}
                                disabled={loading}
                                title="Salvar alterações"
                            >
                                Salvar
                            </button>

                            <button
                                type="button"
                                className="btn-secondary"
                                style={actionBtnStyle}
                                onClick={onCancelEdit}
                                disabled={loading}
                                title="Cancelar edição"
                            >
                                Cancelar
                            </button>
                        </div>
                    );
                }

                return (
                    <div style={actionsWrap}>
                        <button
                            type="button"
                            className="btn-secondary"
                            style={actionBtnStyle}
                            onClick={() => onStartEdit(row)}
                            title="Editar usuário (inline)"
                        >
                            Alterar
                        </button>

                        <button
                            type="button"
                            className="btn-secondary"
                            style={{ ...actionBtnStyle, opacity: isAtivo ? 0.5 : 1 }}
                            disabled={isAtivo || loading}
                            onClick={() => onActivate(row.id)}
                            title="Ativar usuário"
                        >
                            Ativo
                        </button>

                        <button
                            type="button"
                            className="btn-secondary"
                            style={{ ...actionBtnStyle, opacity: !isAtivo ? 0.5 : 1 }}
                            disabled={!isAtivo || loading}
                            onClick={() => onDeactivate(row.id)}
                            title="Inativar usuário"
                        >
                            Inativo
                        </button>
                    </div>
                );
            },
        },
    ];
}
