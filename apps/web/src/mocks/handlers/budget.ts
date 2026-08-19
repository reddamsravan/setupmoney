import { http, HttpResponse } from "msw";

export const budgetHandlers = [
  http.get("/api/v1/budget", () => {
    return HttpResponse.json([
      { category: "Groceries", allocated: 500, spent: 320 },
      { category: "Entertainment", allocated: 200, spent: 150 },
    ]);
  }),
];
