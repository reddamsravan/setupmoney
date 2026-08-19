import { http, HttpResponse } from "msw";

export const assetHandlers = [
  http.get("/api/v1/assets", () => {
    return HttpResponse.json([
      { id: "asset-1", name: "Index Fund ETF", value: 15000, type: "Investment" },
    ]);
  }),
];
