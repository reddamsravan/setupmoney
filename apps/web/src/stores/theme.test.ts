import { describe, expect, it, beforeEach } from "vitest";
import { useTheme } from "./theme";

describe("stores/theme", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  it("defaults to light theme when no saved preference exists", () => {
    const { theme } = useTheme();
    expect(theme()).toBe("light");
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
  });

  it("switches theme and updates data-theme attribute and localStorage", () => {
    const { theme, setTheme, toggleTheme } = useTheme();

    setTheme("dark");
    expect(theme()).toBe("dark");
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    expect(localStorage.getItem("setupmoney_theme")).toBe("dark");

    toggleTheme();
    expect(theme()).toBe("light");
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
    expect(localStorage.getItem("setupmoney_theme")).toBe("light");
  });
});
