import { describe, expect, it } from "vitest";
import { apiService } from "@setupmoney/api";

describe("TanStack Query & MSW integration", () => {
  it("fetches accounts list from mock-service HTTP handlers via apiService", async () => {
    const accounts = await apiService.accounts.list();

    expect(accounts).toHaveLength(2);
    expect(accounts[0]).toEqual({
      id: "acc-1",
      name: "Checking Account",
      balance: 5400.5,
      currency: "USD",
    });
  });

  it("fetches transactions list from mock-service HTTP handlers via apiService", async () => {
    const transactions = await apiService.transactions.list();

    expect(transactions).toHaveLength(2);
    expect(transactions[0].category).toBe("Groceries");
  });

  it("fetches report summary from mock-service HTTP handlers via apiService", async () => {
    const report = await apiService.reports.summary();

    expect(report.totalNetWorth).toBe(32400);
    expect(report.monthlyIncome).toBe(5000);
    expect(report.monthlyExpense).toBe(2300);
  });
});
