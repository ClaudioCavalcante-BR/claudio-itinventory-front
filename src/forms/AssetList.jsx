import { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setFilter, clearFilter } from "../store/index.js";
import { useAssetsActions } from "../context/AssetsContext.jsx";
import AssetForm from "./AssetForm.jsx";
import AssetItem from "./AssetItem.jsx";
import { exportEquipmentsCsv } from "../services/EquipmentService.js";

export default function AssetList() {
    const dispatch = useDispatch();
    const { items, filter } = useSelector((state) => state.assets);

    const { reload, createAsset, updateAsset, deleteAsset } = useAssetsActions();

    useEffect(() => {
        reload();
    }, [reload]);

    const filteredAssets = useMemo(() => {
        if (!filter) return items;
        const lower = filter.toLowerCase();
        return items.filter(
            (a) =>
                a.assetNumber?.toLowerCase().includes(lower) ||
                a.model?.toLowerCase().includes(lower) ||
                a.type?.toLowerCase().includes(lower) ||
                a.location?.toLowerCase().includes(lower)
        );
    }, [items, filter]);

    // ===== Paginação (10 por vez) =====
    const PAGE_SIZE = 10;
    const [page, setPage] = useState(1);

    const totalPages = Math.max(1, Math.ceil(filteredAssets.length / PAGE_SIZE));

    // Evita warning do ESLint: não damos setState em effect para "resetar".
    // Em vez disso, derivamos uma página segura (clamp) e usamos ela para render.
    const safePage = Math.min(Math.max(page, 1), totalPages);

    const pageItems = filteredAssets.slice(
        (safePage - 1) * PAGE_SIZE,
        safePage * PAGE_SIZE
    );

    const pad2 = (n) => String(n).padStart(2, "0");
    const start = filteredAssets.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
    const end = Math.min(safePage * PAGE_SIZE, filteredAssets.length);

    const rangeLabel = `${pad2(start)}–${pad2(end)}`; // ex.: 01–10
    const totalLabel = `${filteredAssets.length}`;    // ex.: 70

    const handlePrev = () => setPage((p) => Math.max(1, p - 1));
    const handleNext = () => setPage((p) => Math.min(totalPages, p + 1));

    // Quando o filtro muda, faz sentido voltar para a primeira página.
    // Para não usar useEffect (e manter ESLint feliz), resetamos ao digitar no input.
    const handleFilterChange = (value) => {
        dispatch(setFilter(value));
        if (page !== 1) setPage(1);
    };

    return (
        <>
            <div className="panel">
                <h2>Cadastro de Ativos</h2>
                <p>Preencha os campos abaixo para cadastrar novos equipamentos de TI.</p>
            </div>

            <AssetForm onCreate={createAsset} />

            <div className="panel">
                <div className="panel-header">
                    <div>
                        <h2>Ativos Cadastrados</h2>
                        <p>
                            Use o campo de busca para filtrar por TAG, nome, categoria ou local.
                        </p>
                    </div>

                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <input
                            type="search"
                            placeholder="Buscar por nome, TAG, categoria, local..."
                            value={filter}
                            onChange={(e) => handleFilterChange(e.target.value)}
                            style={{ minWidth: "260px" }}
                        />

                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={() => {
                                dispatch(clearFilter());
                                if (page !== 1) setPage(1);
                            }}
                        >
                            Limpar
                        </button>

                        <button
                            type="button"
                            className="btn-primary"
                            onClick={exportEquipmentsCsv}
                        >
                            Exportar CSV
                        </button>
                    </div>
                </div>

                <div className="table-wrapper table-scroll">
                    <table className="table-assets">
                        <thead>
                        <tr>
                            <th>TAG</th>
                            <th>Nome</th>
                            <th>Categoria</th>
                            <th>Local</th>
                            <th>Custo</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                        </thead>

                        <tbody>
                        {filteredAssets.length === 0 && (
                            <tr>
                                <td colSpan={7} style={{ textAlign: "center", padding: 16 }}>
                                    Nenhum ativo cadastrado.
                                </td>
                            </tr>
                        )}

                        {pageItems.map((asset) => (
                            <AssetItem
                                key={asset.id}
                                asset={asset}
                                onUpdate={updateAsset}
                                onDelete={deleteAsset}
                            />
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* Rodapé estilo “DataGrid”: range + setas */}
                <div className="table-footer">
          <span className="table-footer-info">
            {rangeLabel} de {totalLabel}
          </span>

                    <button
                        type="button"
                        className="pager-btn"
                        onClick={handlePrev}
                        disabled={safePage === 1}
                        aria-label="Anterior"
                        title="Anterior"
                    >
                        ‹
                    </button>

                    <button
                        type="button"
                        className="pager-btn"
                        onClick={handleNext}
                        disabled={safePage === totalPages}
                        aria-label="Próximo"
                        title="Próximo"
                    >
                        ›
                    </button>
                </div>
            </div>
        </>
    );
}
