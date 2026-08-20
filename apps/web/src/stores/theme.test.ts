import { describe, expect, it, beforeEach, vi } from "vitest";
import { createThemeStore, InMemoryStorageAdapter, useTheme } from "./theme";

describe("stores/theme", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  describe("createThemeStore factory & test isolation seam", () => {
    it("uses InMemoryStorageAdapter to isolate state from global localStorage and DOM", () => {
      const memoryStorage = new InMemoryStorageAdapter();
      const onThemeChange = vi.fn();

      const store = createThemeStore({
        storage: memoryStorage,
        onThemeChange,
      });

      expect(store.theme()).toBe("light");
      expect(localStorage.getItem("setupmoney_theme")).toBeNull();
      expect(document.documentElement.hasAttribute("data-theme")).toBe(false);

      store.setTheme("dark");
      expect(store.theme()).toBe("dark");
      expect(memoryStorage.getItem("setupmoney_theme")).toBe("dark");
      expect(localStorage.getItem("setupmoney_theme")).toBeNull();
      expect(onThemeChange).toHaveBeenCalledWith("dark");
    });

    it("respects initial saved theme from storage adapter", () => {
      const memoryStorage = new InMemoryStorageAdapter();
      memoryStorage.setItem("setupmoney_theme", "dark");

      const store = createThemeStore({ storage: memoryStorage });
      expect(store.theme()).toBe("dark");
    });

    it("falls back to preferredColorScheme when no saved preference exists", () => {
      const memoryStorage = new InMemoryStorageAdapter();
      const store = createThemeStore({
        storage: memoryStorage,
        preferredColorScheme: () => "dark",
      });

      expect(store.theme()).toBe("dark");
    });

    it("toggles theme state correctly", () => {
      const memoryStorage = new InMemoryStorageAdapter();
      const store = createThemeStore({ storage: memoryStorage });

      expect(store.theme()).toBe("light");
      store.toggleTheme();
      expect(store.theme()).toBe("dark");
      store.toggleTheme();
      expect(store.theme()).toBe("light");
    });
  });

  describe("useTheme default global store seam", () => {
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
});
