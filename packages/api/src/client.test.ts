import { describe, expect, it, vi } from "vitest";
import { ApiError, Api } from "./client";

describe("ApiError", () => {
  it("initializes with status, message, and optional payload", () => {
    const error = new ApiError(404, "Not found", { message: "Account not found" });
    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe("ApiError");
    expect(error.status).toBe(404);
    expect(error.message).toBe("Not found");
    expect(error.data).toEqual({ message: "Account not found" });
  });
});

describe("Api wrapper", () => {
  it("Api.get returns parsed JSON on successful 200 response", async () => {
    const mockData = { id: "acc-1", name: "Checking" };
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockData,
    } as Response);

    const result = await Api.get<typeof mockData>("/api/v1/accounts");
    expect(result).toEqual(mockData);
    expect(globalThis.fetch).toHaveBeenCalledWith(
      "/api/v1/accounts",
      expect.objectContaining({ method: "GET" }),
    );
  });

  it("Api.post throws ApiError on HTTP 400 error response", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      statusText: "Bad Request",
      json: async () => ({ message: "Invalid payload" }),
    } as Response);

    await expect(Api.post("/api/v1/accounts", { name: "Test" })).rejects.toThrow(ApiError);
  });
});
