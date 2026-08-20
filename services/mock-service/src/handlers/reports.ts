import { http, HttpResponse } from "msw";

export const reportHandlers = [
  http.get("/api/v1/reports", () => {
    return HttpResponse.json({
      totalNetWorth: 32400,
      monthlyIncome: 5000,
      monthlyExpense: 2300,
    });
  }),
];
