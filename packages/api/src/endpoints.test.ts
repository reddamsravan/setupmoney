import { describe, expect, it } from "vitest";
import { Endpoints } from "./endpoints";

describe("Endpoints builder", () => {
  it("builds basic endpoint paths", () => {
    expect(Endpoints.accounts.list()).toBe("/api/v1/accounts");
    expect(Endpoints.accounts.detail("acc-123")).toBe("/api/v1/accounts/acc-123");
    expect(Endpoints.goals.list()).toBe("/api/v1/goals");
    expect(Endpoints.assets.list()).toBe("/api/v1/assets");
  });

  it("encodes path parameters properly", () => {
    expect(Endpoints.budget.detail("Dining Out")).toBe("/api/v1/budget/Dining%20Out");
  });

  it("serializes query parameters automatically", () => {
    const url = Endpoints.transactions.list({ category: "Groceries", page: 2 });
    expect(url).toBe("/api/v1/transactions?category=Groceries&page=2");
  });

  it("omits empty or undefined query parameters", () => {
    const url = Endpoints.transactions.list({ category: undefined, search: "" });
    expect(url).toBe("/api/v1/transactions");
  });
});
