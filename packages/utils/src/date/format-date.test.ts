import { describe, expect, it } from "vitest";
import { formatDate } from "./format-date";

describe("date/format-date", () => {
  const sampleDate = new Date("2026-08-17T12:00:00Z");

  it("formats date using default 'short' format and en-US locale", () => {
    const result = formatDate(sampleDate);
    expect(result).toBe("Aug 17, 2026");
  });

  it("accepts ISO string input", () => {
    const result = formatDate("2026-08-17T12:00:00Z");
    expect(result).toBe("Aug 17, 2026");
  });

  it("formats date using 'full' format", () => {
    const result = formatDate(sampleDate, { format: "full" });
    expect(result).toBe("August 17, 2026");
  });

  it("formats relative dates matching 'today'", () => {
    const now = new Date();
    const result = formatDate(now, { format: "relative" });
    expect(result).toBe("today");
  });

  it("supports custom locale (e.g. en-IN)", () => {
    const result = formatDate(sampleDate, { format: "short", locale: "en-IN" });
    expect(result).toBe("17 Aug 2026");
  });
});
