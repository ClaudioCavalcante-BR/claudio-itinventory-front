import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../api", () => ({
    default: { get: vi.fn() },
}));

import api from "../api";
import { fetchEquipments } from "../EquipmentService";

describe("EquipmentService - fetchEquipments", () => {
    beforeEach(() => vi.clearAllMocks());

    it("chama /api/equipments com params page/size e retorna data.content", async () => {
        api.get.mockResolvedValue({
            data: { content: [{ id: 1 }, { id: 2 }] },
        });

        const result = await fetchEquipments({ page: 0, size: 100 });

        expect(api.get).toHaveBeenCalledWith("/api/equipments", { params: { page: 0, size: 100 } });
        expect(result).toEqual([{ id: 1 }, { id: 2 }]);
    });

    it("quando backend retorna array direto, devolve o array", async () => {
        api.get.mockResolvedValue({ data: [{ id: 10 }] });

        const result = await fetchEquipments({ page: 1, size: 5 });

        expect(result).toEqual([{ id: 10 }]);
    });
});
