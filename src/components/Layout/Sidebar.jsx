import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { FaHome, FaTruck, FaUsers } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext"; // ajuste o path se seu AuthContext estiver em outro lugar

const links = [
    {
        to: "/dashboard",
        label: (
            <>
                <FaHome /> Dashboard
            </>
        ),
    },
    {
        to: "/assets",
        label: (
            <>
                <FaTruck /> Cadastro de Ativos
            </>
        ),
    },
    {
        to: "/users",
        label: (
            <>
                <FaUsers /> Usuários
            </>
        ),
    },
];

function NavList({ children }) {
    return <div>{children}</div>;
}
NavList.propTypes = { children: PropTypes.node };

function NavItem({ to, children }) {
    const nav = useNavigate();
    return (
        <button onClick={() => nav(to)} className="nav-btn">
            {children}
        </button>
    );
}
NavItem.propTypes = { to: PropTypes.string.isRequired, children: PropTypes.node };

export default function Sidebar() {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();

    const [isBlur, setIsBlur] = useState(() => !document.body.classList.contains("no-blur"));

    const toggleBackground = () => {
        const next = !isBlur;
        document.body.classList.toggle("no-blur", !next);
        setIsBlur(next);
    };

    const handleLogout = () => {
        logout();
        navigate("/login", { replace: true });
    };

    return (
        <div
            className="sidebar panel"
            style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}
        >
            <div>
                <h4 style={{ marginTop: 0 }}>Navegação</h4>

                <NavList>
                    {links.map((l) => (
                        <NavItem key={l.to} to={l.to}>
                            <span className={pathname === l.to ? "active" : ""}>{l.label}</span>
                        </NavItem>
                    ))}
                </NavList>

                <p className="muted" style={{ marginTop: 10, fontSize: 10, opacity: 0.4 }}>
                    {pathname === "/dashboard"
                        ? "Está em Dashboard"
                        : pathname === "/assets"
                            ? "Está em Ativos"
                            : pathname === "/users"
                                ? "Está em Usuários"
                                : ""}
                </p>
            </div>

            <div>
                <hr style={{ margin: "16px 0", opacity: 0.15, borderColor: "var(--border)" }} />

                <button className="nav-btn" onClick={handleLogout}>
                    Sair
                </button>

                <button className="toggle-btn" onClick={toggleBackground}>
                    {isBlur ? "Imagem translúcida" : "Imagem nítida"}
                </button>
            </div>
        </div>
    );
}
