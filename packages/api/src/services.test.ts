import { describe, expect, it, vi } from "vitest";
import { apiService } from "./index";

describe("domain API services", () => {
  it("apiService.accounts.list fetches accounts using Endpoints.accounts.list()", async () => {
    const mockAccounts = [{ id: "acc-1", name: "Checking", balance: 1000, currency: "USD" }];
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockAccounts,
    } as Response);

    const result = await apiService.accounts.list();
    expect(result).toEqual(mockAccounts);
    expect(globalThis.fetch).toHaveBeenCalledWith(
      "/api/v1/accounts",
      expect.objectContaining({ method: "GET" }),
    );
  });

  it("apiService.accounts.create posts new account using Endpoints.accounts.list()", async () => {
    const newAccount = { name: "Savings", balance: 5000, currency: "USD" };
    const createdAccount = { id: "acc-2", ...newAccount };
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => createdAccount,
    } as Response);

    const result = await apiService.accounts.create(newAccount);
    expect(result).toEqual(createdAccount);
    expect(globalThis.fetch).toHaveBeenCalledWith(
      "/api/v1/accounts",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify(newAccount),
      }),
    );
  });
});
