import { describe, expect, it } from "vitest";

describe("MSW integration in Vitest", () => {
  it("intercepts /api/v1/accounts fetch requests", async () => {
    const res = await fetch("/api/v1/accounts");
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toHaveLength(2);
    expect(data[0]).toEqual({
      id: "acc-1",
      name: "Checking Account",
      balance: 5400.5,
      currency: "USD",
    });
  });

  it("intercepts /api/v1/transactions fetch requests", async () => {
    const res = await fetch("/api/v1/transactions");
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toHaveLength(2);
    expect(data[0].category).toBe("Groceries");
  });
});
