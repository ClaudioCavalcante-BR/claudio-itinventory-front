// src/services/UserService.js
import api from "./api";

function unwrapPage(data) {
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.content)) return data.content;
    return [];
}
/**
 * Buscar usuário por ID (ADMIN)
 * Endpoint esperado: GET /api/usuarios/{id}
 */
export async function fetchUserById(id) {
    const { data } = await api.get(`/api/usuarios/${id}`);
    return data;
}

/**
 * Atualizar usuário (ADMIN)
 * Endpoint esperado: PUT /api/usuarios/{id}
 */
export async function updateUser(id, payload) {
    //const { data } = await api.put(`/api/usuarios/${id}`, payload);
    //return data;
    return api.put(`/api/usuarios/${id}`, payload);
}
export function listUsers(page = 0, size = 100) {
    return api.get(`/api/usuarios?page=${page}&size=${size}`);
}

export function listProfiles() {
    return api.get(`/api/profiles`);
}
/**
 * Excluir usuário (ADMIN)
 * Endpoint esperado: DELETE /api/usuarios/{id}
 */
export async function deleteUser(id) {
    await api.delete(`/api/usuarios/${id}`);
}

// Ativar/Inativar (soft delete)
export async function activateUser(userId) {
    const { data } = await api.patch(`/api/usuarios/${userId}/ativar`, {});
    return data;
}

export async function deactivateUser(userId) {
    const { data } = await api.patch(`/api/usuarios/${userId}/inativar`, {});
    return data;
}

/**
 * Criar usuário (ADMIN logado)
 * - Usa Axios (api) e o Bearer Token vai automaticamente pelo interceptor do api.js
 */
export async function createUser(payload) {
    const { data } = await api.post("/api/usuarios", payload);
    return data;
}

/**
 * Se você já tinha importações usando registerUser, mantenha como alias.
 * Se não usa em lugar nenhum, você pode remover este export depois.
 */
export const registerUser = createUser;

/**
 * Listar usuários (ADMIN)
 */
export async function fetchUsers({ page = 0, size = 100 } = {}) {
    const { data } = await api.get("/api/usuarios", { params: { page, size } });
    return unwrapPage(data);
}



// Exportar CSV de usuários (Bearer via api interceptor)
export async function exportUsersCsv() {
    try {
        const res = await api.get("/api/usuarios/export", {
            responseType: "blob",
        });

        // tenta pegar nome do arquivo do header (se o backend enviar)
        let filename = "usuarios.csv";
        const cd = res.headers?.["content-disposition"];
        if (cd) {
            // suporta: filename="usuarios.csv"  OU  filename*=UTF-8''usuarios.csv
            const utf8Match = cd.match(/filename\*\=UTF-8''([^;]+)/i);
            const asciiMatch = cd.match(/filename\=\"?([^\";]+)\"?/i);

            if (utf8Match?.[1]) filename = decodeURIComponent(utf8Match[1]);
            else if (asciiMatch?.[1]) filename = asciiMatch[1];
        }

        const contentType = res.headers?.["content-type"] || "text/csv;charset=utf-8";
        const blob = new Blob([res.data], { type: contentType });

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
    } catch (err) {
        console.error("Erro ao exportar CSV de usuários", err);

        const status = err?.response?.status;
        if (status === 401 || status === 403) {
            alert("Falha ao exportar. Faça login novamente.");
        } else {
            alert("Falha ao exportar. Verifique o servidor e tente novamente.");
        }
    }
}
