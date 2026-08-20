import { describe, expect, it } from "vitest";
import { queryClient } from "./query-client";

describe("queryClient", () => {
  it("initializes with configured default query options", () => {
    const defaultOptions = queryClient.getDefaultOptions();
    expect(defaultOptions.queries?.staleTime).toBe(1000 * 60 * 5);
    expect(defaultOptions.queries?.refetchOnWindowFocus).toBe(false);
  });
});
