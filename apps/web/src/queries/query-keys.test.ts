import { describe, expect, it } from "vitest";
import {
  accountKeys,
  transactionKeys,
  budgetKeys,
  goalKeys,
  assetKeys,
  reportKeys,
} from "./query-keys";

describe("query-keys factory", () => {
  it("generates deterministic query keys for accounts", () => {
    expect(accountKeys.all).toEqual(["accounts"]);
    expect(accountKeys.lists()).toEqual(["accounts", "list"]);
    expect(accountKeys.detail("acc-1")).toEqual(["accounts", "detail", "acc-1"]);
  });

  it("generates deterministic query keys for transactions with params", () => {
    expect(transactionKeys.all).toEqual(["transactions"]);
    expect(transactionKeys.list({ category: "Groceries" })).toEqual([
      "transactions",
      "list",
      { category: "Groceries" },
    ]);
  });

  it("generates deterministic query keys for budget, goals, assets, and reports", () => {
    expect(budgetKeys.detail("Dining")).toEqual(["budget", "detail", "Dining"]);
    expect(goalKeys.lists()).toEqual(["goals", "list"]);
    expect(assetKeys.lists()).toEqual(["assets", "list"]);
    expect(reportKeys.summary({ period: "2026-08" })).toEqual([
      "reports",
      "summary",
      { period: "2026-08" },
    ]);
  });
});
