import { describe, expect, it } from "vitest";
import { ThemeToggle } from "./theme-toggle";

describe("ThemeToggle", () => {
  it("exports ThemeToggle component function", () => {
    expect(typeof ThemeToggle).toBe("function");
  });
});
