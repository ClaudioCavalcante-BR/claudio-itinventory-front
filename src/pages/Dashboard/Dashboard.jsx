import { useMemo } from "react";
import { useSelector } from "react-redux";

export default function Dashboard() {
    // Lê a lista global de ativos do Redux
    const items = useSelector((state) => state.assets.items);

    const stats = useMemo(() => {
        const total = items.length;
        const emManutencao = items.filter(
            (a) => a.status === "EM_MANUTENCAO"
        ).length;
        const baixados = items.filter(
            (a) => a.status === "DESCARTADO"
        ).length;
        const valorTotal = items.reduce(
            (sum, a) => sum + (Number(a.acquisitionValue) || 0),
            0
        );

        return { total, emManutencao, baixados, valorTotal };
    }, [items]);

    return (
        <div className="dashboard">
            <div className="panel">
                <h1>Visão Geral dos Ativos</h1>
                <p>
                    Acompanhe rapidamente a quantidade de equipamentos e o valor total do
                    inventário de TI.
                </p>
            </div>

            <div className="cards-grid">
                <div className="panel kpi-card">
                    <h2>Ativos cadastrados</h2>
                    <p className="kpi-value">{stats.total}</p>
                </div>

                <div className="panel kpi-card">
                    <h2>Em manutenção</h2>
                    <p className="kpi-value">{stats.emManutencao}</p>
                </div>

                <div className="panel kpi-card">
                    <h2>Baixados</h2>
                    <p className="kpi-value">{stats.baixados}</p>
                </div>

                <div className="panel kpi-card">
                    <h2>Valor total do ativo</h2>
                    <p className="kpi-value">
                        {stats.valorTotal.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                        })}
                    </p>
                </div>
            </div>
        </div>
    );
}
