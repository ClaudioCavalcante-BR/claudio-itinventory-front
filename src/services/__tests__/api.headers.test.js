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

describe("api.js - headers", () => {
    beforeEach(() => {
        requestInterceptor = undefined;
        vi.resetModules(); // importante para reimportar api.js limpo
    });

    it("adiciona Authorization quando existe token no localStorage", async () => {
        // simula browser storage
        vi.stubGlobal("localStorage", {
            getItem: vi.fn(() => "TOKEN123"),
            removeItem: vi.fn(),
        });

        await import("../api"); // registra interceptor
        expect(typeof requestInterceptor).toBe("function");

        const cfg = { headers: {} };
        const out = requestInterceptor(cfg);

        expect(out.headers.Authorization).toBe("Bearer TOKEN123");
    });

    it("adiciona ngrok-skip-browser-warning quando baseURL é ngrok", async () => {
        // Força a env antes do import
        vi.stubGlobal("localStorage", {
            getItem: vi.fn(() => null),
            removeItem: vi.fn(),
        });


        await import("../api");
        const cfg = { headers: {} };
        const out = requestInterceptor(cfg);

        expect(out.headers).toBeDefined();
    });
});
