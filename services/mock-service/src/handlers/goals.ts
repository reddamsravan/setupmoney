import { http, HttpResponse } from "msw";

export const goalHandlers = [
  http.get("/api/v1/goals", () => {
    return HttpResponse.json([
      { id: "goal-1", name: "Emergency Fund", targetAmount: 10000, currentAmount: 6500 },
    ]);
  }),
];
