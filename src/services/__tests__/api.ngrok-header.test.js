import { describe, it, expect, vi, beforeEach } from "vitest";

let requestInterceptor;

vi.mock("axios", () => ({
    default: {
        create: vi.fn(() => ({
            interceptors: {
                request: {
                    use: vi.fn((fn) => {
                        requestInterceptor = fn;
                    }),
                },
                response: { use: vi.fn() },
            },
        })),
    },
}));

describe("api.js - ngrok header (forte)", () => {
    beforeEach(() => {
        requestInterceptor = undefined;
        vi.resetModules(); // reimporta api.js usando env do modo test
    });

    it("injeta ngrok-skip-browser-warning quando VITE_API_BASE_URL é ngrok", async () => {
        vi.stubGlobal("localStorage", {
            getItem: vi.fn(() => null),
            removeItem: vi.fn(),
        });

        await import("../api"); // registra interceptor
        expect(typeof requestInterceptor).toBe("function");

        const cfg = { headers: {} };
        const out = requestInterceptor(cfg);

        expect(out.headers["ngrok-skip-browser-warning"]).toBe("true");
    });
});
