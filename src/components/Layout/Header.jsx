import { useEffect, useState } from "react";

import ClassClock from "../Demo/ClassClock.jsx";


export default function Header() {
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const id = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(id);
    }, []);

    const timeBrasilia = now.toLocaleTimeString("pt-BR", {
        timeZone: "America/Sao_Paulo",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });

    return (
        <header className="app-header">
        <div className="header-inner">
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 16,
                flexWrap: "wrap" }}>
                <h3 style={{ margin: 0 }}>Controller Inventory • Gestão de Ativos</h3>
                <small className="muted">Brasília: {timeBrasilia}</small>
            </div>

        </div>
        </header>
    );
}
