import { http, HttpResponse } from "msw";

export const accountHandlers = [
  http.get("/api/v1/accounts", () => {
    return HttpResponse.json([
      { id: "acc-1", name: "Checking Account", balance: 5400.5, currency: "USD" },
      { id: "acc-2", name: "Savings Account", balance: 12000.0, currency: "USD" },
    ]);
  }),
];
