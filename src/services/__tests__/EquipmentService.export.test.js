import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../api", () => ({
    default: { get: vi.fn() },
}));

import api from "../api";
import { exportEquipmentsCsv } from "../EquipmentService";

describe("EquipmentService - export CSV", () => {
    beforeEach(() => vi.clearAllMocks());

    it("chama endpoint de exportação com responseType blob", async () => {
        api.get.mockResolvedValue({ data: new Uint8Array([1, 2, 3]) });

        global.URL.createObjectURL = vi.fn(() => "blob:mock");
        global.URL.revokeObjectURL = vi.fn();

        vi.spyOn(document, "createElement").mockReturnValue({
            click: vi.fn(),
            remove: vi.fn(),
            set href(_) {},
            set download(_) {},
        });

        vi.spyOn(document.body, "appendChild").mockImplementation(() => {});

        await exportEquipmentsCsv();

        expect(api.get).toHaveBeenCalledWith("/api/equipments/export", { responseType: "blob" });
    });
});
