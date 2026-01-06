// src/services/AuthService.js
import api from "./api";

// Login -> recebe token (string ou {token})
export async function loginRequest({ email, password }) {
    const { data } = await api.post("/api/usuarios/login", { email, password });

    if (typeof data === "string") return data;
    if (data && data.token) return data.token;

    throw new Error("Formato inesperado de retorno do login");
}

// Perfil do usuário logado
export async function getMyProfile() {
    const { data } = await api.get("/api/usuarios/my-profile");
    return data;
}
