import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

// Guard: permite acessar a rota somente se o usuário logado for ADMIN.
export default function AdminRoute({ children }) {
    const { isLogged, user, loading } = useAuth();

    // Evita redirect antes do my-profile terminar de carregar
    if (loading) return null;

    if (!isLogged) return <Navigate to="/login" replace />;

    const role = String(
        user?.profileCode ??
        user?.profile ??
        user?.role ??
        user?.profile?.code ??
        user?.profile?.profileCode ??
        ""
    ).toUpperCase();

    if (role !== "ADMIN") return <Navigate to="/dashboard" replace />;

    return children;
}
