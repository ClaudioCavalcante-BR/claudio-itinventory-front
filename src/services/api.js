// src/services/api.js
import axios from "axios";

export const TOKEN_KEY = "itinventory_equip.token";

// Base URL e timeout por ambiente
const baseURL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8081")
    .replace(/\/+$/, ""); // remove barra final

const timeout = Number(import.meta.env.VITE_API_TIMEOUT || 15000);

// Guard de segurança: em produção, exigir HTTPS
if (import.meta.env.PROD) {
    const isHttps = baseURL.startsWith("https://");
    if (!isHttps) {
        throw new Error(
            `Configuração insegura: VITE_API_BASE_URL deve usar HTTPS em produção. Valor atual: ${baseURL}`
        );
    }
}

// Diagnóstico: evita cenário de "mixed content" (página HTTPS chamando API HTTP)
if (typeof window !== "undefined") {
    const pageIsHttps = window.location.protocol === "https:";
    const apiIsHttp = baseURL.startsWith("http://");
    if (pageIsHttps && apiIsHttp) {
        console.warn(
            `Mixed content: página HTTPS chamando API HTTP (${baseURL}). O navegador pode bloquear as requisições.`
        );
    }
}

const api = axios.create({
    baseURL,
    timeout,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem(TOKEN_KEY);

    config.headers = config.headers ?? {};

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// helper: dispara mensagem global para o AppLayout
function flash(message) {
    if (typeof window === "undefined") return;
    if (!message) return;

    window.dispatchEvent(
        new CustomEvent("app:flash", {
            detail: { message: String(message) },
        })
    );
}

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status;
        const url = String(error?.config?.url ?? "");

        // Não interferir no login (senha inválida etc. deve ser tratado na tela de login)
        if (url.includes("/api/usuarios/login")) {
            return Promise.reject(error);
        }

        const data = error?.response?.data;
        const backendMsg =
            (typeof data === "string" && data) ||
            data?.message ||
            data?.mensagem ||
            data?.error ||
            data?.detail;

        // se for 403 por token inválido (seu EntryPoint pode devolver 403 nesses casos)
        const isTokenIssue =
            status === 401 ||
            (status === 403 &&
                /token|jwt|expirad|expired|inválid|inval/i.test(String(backendMsg ?? "")));

        // 403 (sem permissão) -> NÃO desloga, apenas mostra mensagem
        if (status === 403 && !isTokenIssue) {
            flash(backendMsg || "Você não tem permissão para realizar esta ação.");
            return Promise.reject(error);
        }

        // 401 ou 403 por token inválido -> limpa token e volta pro login
        if (isTokenIssue) {
            flash(backendMsg || "Sessão inválida/expirada. Faça login novamente.");
            localStorage.removeItem(TOKEN_KEY);

            if (typeof window !== "undefined" && window.location.pathname !== "/login") {
                window.location.href = "/login";
            }

            return Promise.reject(error);
        }

        return Promise.reject(error);
    }
);

export default api;
