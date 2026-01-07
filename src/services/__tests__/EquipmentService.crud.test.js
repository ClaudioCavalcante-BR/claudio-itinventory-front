import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../api", () => ({
    default: {
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
    },
}));

import api from "../api";
import { createEquipment, updateEquipment, deleteEquipment } from "../EquipmentService";

describe("EquipmentService - CRUD", () => {
    beforeEach(() => vi.clearAllMocks());

    it("createEquipment faz POST em /api/equipments e retorna data", async () => {
        const payload = { type: "SERVIDOR" };
        api.post.mockResolvedValue({ data: { id: 123, ...payload } });

        const res = await createEquipment(payload);

        expect(api.post).toHaveBeenCalledWith("/api/equipments", payload);
        expect(res).toEqual({ id: 123, type: "SERVIDOR" });
    });

    it("updateEquipment faz PUT em /api/equipments/:id", async () => {
        const payload = { status: "EM_ESTOQUE" };
        api.put.mockResolvedValue({ data: { id: 7, ...payload } });

        const res = await updateEquipment(7, payload);

        expect(api.put).toHaveBeenCalledWith("/api/equipments/7", payload);
        expect(res).toEqual({ id: 7, status: "EM_ESTOQUE" });
    });

    it("deleteEquipment faz DELETE em /api/equipments/:id", async () => {
        api.delete.mockResolvedValue({});

        await deleteEquipment(9);

        expect(api.delete).toHaveBeenCalledWith("/api/equipments/9");
    });
});
