import { describe, expect, it } from "vitest";
import { api } from "@setupmoney/api";

describe("TanStack Query & MSW integration", () => {
  it("fetches accounts list from mock-service HTTP handlers via api", async () => {
    const accounts = await api.accounts.list();

    expect(accounts).toHaveLength(2);
    expect(accounts[0]).toEqual({
      id: "acc-1",
      name: "Checking Account",
      balance: 5400.5,
      currency: "USD",
    });
  });

  it("fetches transactions list from mock-service HTTP handlers via api", async () => {
    const transactions = await api.transactions.list();

    expect(transactions).toHaveLength(2);
    expect(transactions[0]?.category).toBe("Groceries");
  });

  it("fetches report summary from mock-service HTTP handlers via api", async () => {
    const report = await api.reports.summary();

    expect(report.totalNetWorth).toBe(32400);
    expect(report.monthlyIncome).toBe(5000);
    expect(report.monthlyExpense).toBe(2300);
  });
});
