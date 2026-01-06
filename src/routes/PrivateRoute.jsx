import PropTypes from "prop-types";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function PrivateRoute({ children }) {
    const { isLogged, loading } = useAuth();
    const location = useLocation();

    // Enquanto estiver carregando o perfil (my-profile)
    if (loading) {
        return <p style={{ padding: 24 }}>Carregando...</p>;
    }

    // Se não estiver logado, manda para /login
    if (!isLogged) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    // Se estiver logado, renderiza o conteúdo protegido
    return children;
}

PrivateRoute.propTypes = {
    children: PropTypes.node.isRequired,
};
