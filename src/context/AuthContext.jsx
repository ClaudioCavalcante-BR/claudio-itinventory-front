/* eslint-disable react-refresh/only-export-components */

import { TOKEN_KEY } from "../services/api";



import { createContext, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { loginRequest, getMyProfile } from "../services/AuthService.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY)

);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(!!token);

    // Carrega perfil se tiver token
    useEffect(() => {
        async function loadProfile() {
            if (!token) {
                setUser(null);
                setLoading(false);
                return;
            }
            try {
                const profile = await getMyProfile();
                setUser(profile);
            } catch (err) {
                console.error("Erro ao buscar perfil", err);
                localStorage.removeItem(TOKEN_KEY);
                setToken(null);
                setUser(null);
            } finally {
                setLoading(false);
            }
        }
        loadProfile();
    }, [token]);

    async function login(email, password) {
        const receivedToken = await loginRequest({ email, password });

        if (!receivedToken) throw new Error("Token não retornado no login");

        localStorage.setItem(TOKEN_KEY, receivedToken);
        setToken(receivedToken);
    }

    function logout() {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setUser(null);
    }


    const isLogged = !!token;

    return (
        <AuthContext.Provider
            value={{ isLogged, token, user, login, logout, loading }}
        >
            {children}
        </AuthContext.Provider>
    );
}

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
