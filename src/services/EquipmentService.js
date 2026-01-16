// src/services/EquipmentService.js
import api from "./api";

// Se o backend devolver Page<DTO>, pegamos .content
function unwrapPage(data) {
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.content)) return data.content;
    return [];
}

export async function fetchEquipments({ page = 0, size = 100 } = {}) {
    const { data } = await api.get("/api/equipments", { params: { page, size } });
    return unwrapPage(data);
}

export async function fetchEquipmentsPage({ page = 0, size = 10 } = {}) {
    const { data } = await api.get("/api/equipments", { params: { page, size } });

    const items = Array.isArray(data?.content) ? data.content : [];
    const meta = data?.page ?? {};

    return {
        items,
        page: meta.number ?? page,
        size: meta.size ?? size,
        totalElements: meta.totalElements ?? items.length,
        totalPages: meta.totalPages ?? 1,
    };
}

export async function createEquipment(payload) {
    const { data } = await api.post("/api/equipments", payload);
    return data;
}

export async function updateEquipment(id, payload) {
    const { data } = await api.put(`/api/equipments/${id}`, payload);
    return data;
}

export async function deleteEquipment(id) {
    await api.delete(`/api/equipments/${id}`);
}

// Exportar CSV de equipamentos (Bearer via api interceptor)
export async function exportEquipmentsCsv() {
    const res = await api.get("/api/equipments/export", { responseType: "blob" });

    const blob = new Blob([res.data], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "equipamentos.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(url);
}
