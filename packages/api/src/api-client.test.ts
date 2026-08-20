import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createApiClient, api, ApiError } from "./api-client";

describe("ApiClient (Deep Module)", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it("fetches accounts list with correct URL and headers", async () => {
    const mockAccounts = [
      {
        id: "acc-1",
        name: "Checking",
        type: "checking",
        balance: 1000,
        currency: "USD",
        created_at: "2026-01-01",
        updated_at: "2026-01-01",
      },
    ];
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockAccounts,
    } as Response);

    const accounts = await api.accounts.list();

    expect(globalThis.fetch).toHaveBeenCalledWith(
      "/api/v1/accounts",
      expect.objectContaining({
        method: "GET",
      }),
    );
    expect(accounts).toEqual(mockAccounts);
  });

  it("builds query string correctly for transaction filtering", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => [],
    } as Response);

    await api.transactions.list({ search: "groceries", category: "food", page: 2 });

    expect(globalThis.fetch).toHaveBeenCalledWith(
      "/api/v1/transactions?search=groceries&category=food&page=2",
      expect.objectContaining({ method: "GET" }),
    );
  });

  it("handles account creation with JSON body", async () => {
    const newAccount = { name: "Savings", type: "savings" as const, balance: 500, currency: "USD" };
    const created = {
      id: "acc-2",
      ...newAccount,
      created_at: "2026-01-01",
      updated_at: "2026-01-01",
    };

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => created,
    } as Response);

    const res = await api.accounts.create(newAccount);

    expect(globalThis.fetch).toHaveBeenCalledWith(
      "/api/v1/accounts",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify(newAccount),
      }),
    );
    expect(res).toEqual(created);
  });

  it("throws ApiError on HTTP error status", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: "Not Found",
      json: async () => ({ message: "Account not found" }),
    } as Response);

    await expect(api.accounts.detail("invalid-id")).rejects.toThrow(ApiError);
  });

  it("provides query key generators directly on resource namespaces", () => {
    expect(api.accounts.keys.all).toEqual(["accounts"]);
    expect(api.accounts.keys.list()).toEqual(["accounts", "list"]);
    expect(api.accounts.keys.detail("acc-1")).toEqual(["accounts", "detail", "acc-1"]);

    expect(api.transactions.keys.list({ category: "food" })).toEqual([
      "transactions",
      "list",
      { category: "food" },
    ]);
  });

  it("supports custom base path and custom fetcher via createApiClient", async () => {
    const customFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => [],
    } as Response);

    const customClient = createApiClient({
      basePath: "/custom/v2",
      fetcher: customFetch,
    });

    await customClient.goals.list();

    expect(customFetch).toHaveBeenCalledWith(
      "/custom/v2/goals",
      expect.objectContaining({ method: "GET" }),
    );
  });
});
