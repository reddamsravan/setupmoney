import { http, HttpResponse } from "msw";

export const transactionHandlers = [
  http.get("/api/v1/transactions", () => {
    return HttpResponse.json([
      { id: "tx-1", amount: -45.5, category: "Groceries", date: "2026-08-19" },
      { id: "tx-2", amount: 2500.0, category: "Salary", date: "2026-08-15" },
    ]);
  }),
];
