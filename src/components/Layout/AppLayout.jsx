import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";

export default function AppLayout() {
    const [sharpMode, setSharpMode] = useState(false);
    const [flash, setFlash] = useState(null);

    const navigate = useNavigate();
    const { logout, user } = useAuth();

    const role = String(
        user?.profileCode ?? user?.profile ?? user?.role ?? user?.profile?.code ?? ""
    ).toUpperCase();

    // OUVIR mensagens globais disparadas pelo api.js (403 etc.)
    useEffect(() => {
        const handler = (evt) => {
            const msg = evt?.detail?.message;
            if (!msg) return;

            setFlash(String(msg));

            window.clearTimeout(window.__itinvFlashTimer);
            window.__itinvFlashTimer = window.setTimeout(() => setFlash(null), 6000);
        };

        window.addEventListener("app:flash", handler);
        return () => window.removeEventListener("app:flash", handler);
    }, []);

    function toggleBackgroundMode() {
        setSharpMode((prev) => {
            const next = !prev;

            if (next) document.body.classList.add("no-blur");
            else document.body.classList.remove("no-blur");

            return next;
        });
    }

    function handleLogout() {
        logout();
        navigate("/login", { replace: true });
    }

    function handleGoToEntry() {
        navigate("/", { replace: true });
    }

    return (
        <div className="app-shell">
            <aside className="sidebar">
                <div className="sidebar-top">
                    <h1 className="logo">Controller-Inventory</h1>

                    <nav className="nav">
                        <NavLink to="/dashboard">Dashboard</NavLink>
                        <NavLink to="/assets">Ativos</NavLink>
                        {role === "ADMIN" && <NavLink to="/users">Usuários</NavLink>}
                    </nav>
                </div>

                <div className="sidebar-bottom">
                    <button className="toggle-btn" onClick={toggleBackgroundMode}>
                        {sharpMode ? "Imagem nítida" : "Imagem translúcida"}
                    </button>

                    <button className="toggle-btn" onClick={handleLogout}>
                        Sair
                    </button>

                    <div style={{ marginTop: 12 }} />

                    <button className="toggle-btn" onClick={handleGoToEntry}>
                        Tela de entrada
                    </button>
                </div>
            </aside>

            <main className="main-content">
                <div className="main-inner">
                    {flash && (
                        <div
                            role="alert"
                            style={{
                                marginBottom: 12,
                                padding: "10px 12px",
                                borderRadius: 10,
                                background: "rgba(220, 38, 38, 0.18)",
                                border: "1px solid rgba(220, 38, 38, 0.35)",
                                color: "#fff",
                                fontSize: 14,
                            }}
                        >
                            {flash}
                        </div>
                    )}

                    <Header />
                    <div className="main-body">
                        <Outlet />
                    </div>
                </div>

                <Footer />
            </main>
        </div>
    );
}
