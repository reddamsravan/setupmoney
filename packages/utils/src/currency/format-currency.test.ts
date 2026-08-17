import { describe, expect, it } from "vitest";
import { formatCurrency } from "./format-currency";

describe("currency/format-currency", () => {
  it("formats positive numbers using default currency USD and locale en-US", () => {
    const result = formatCurrency(1234.56);
    expect(result).toBe("$1,234.56");
  });

  it("formats zero amount correctly", () => {
    const result = formatCurrency(0);
    expect(result).toBe("$0.00");
  });

  it("formats negative amounts correctly", () => {
    const result = formatCurrency(-50);
    expect(result).toBe("-$50.00");
  });

  it("supports custom currency code (e.g. EUR)", () => {
    const result = formatCurrency(100, { currency: "EUR", locale: "en-US" });
    expect(result).toBe("€100.00");
  });

  it("supports custom locale (e.g. de-DE for EUR)", () => {
    const result = formatCurrency(100, { currency: "EUR", locale: "de-DE" });
    // Note: non-breaking space in German formatting
    expect(result.replace(/\u00a0/g, " ")).toBe("100,00 €");
  });

  it("supports INR currency formatting with Indian locale en-IN", () => {
    const result = formatCurrency(100000, { currency: "INR", locale: "en-IN" });
    // Indian numbering format: ₹1,00,000.00
    expect(result.replace(/\u00a0/g, " ")).toBe("₹1,00,000.00");
  });
});
