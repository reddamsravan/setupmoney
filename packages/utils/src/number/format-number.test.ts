import { describe, expect, it } from "vitest";
import { formatNumber } from "./format-number";

describe("number/format-number", () => {
  it("formats decimal numbers with default locale en-US", () => {
    const result = formatNumber(1234567.89);
    expect(result).toBe("1,234,567.89");
  });

  it("formats integers without trailing decimals by default", () => {
    const result = formatNumber(1000);
    expect(result).toBe("1,000");
  });

  it("formats percentages correctly (e.g. 0.75 -> 75%)", () => {
    const result = formatNumber(0.75, { style: "percent" });
    expect(result).toBe("75%");
  });

  it("formats percentages with fraction digits (e.g. 0.1234 -> 12.3%)", () => {
    const result = formatNumber(0.1234, { style: "percent" });
    expect(result).toBe("12.3%");
  });

  it("respects custom fraction digits options", () => {
    const result = formatNumber(12.34567, {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    });
    expect(result).toBe("12.346");
  });

  it("supports custom locale (e.g. en-IN)", () => {
    const result = formatNumber(100000, { locale: "en-IN" });
    expect(result).toBe("1,00,000");
  });
});
