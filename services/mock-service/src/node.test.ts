import { describe, expect, it } from "vitest";
import { server } from "./node";

describe("mock-service Node server", () => {
  it("exports a configured setupServer instance", () => {
    expect(server).toBeDefined();
    expect(typeof server.listen).toBe("function");
  });
});
