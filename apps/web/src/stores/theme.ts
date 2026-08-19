import { createSignal } from "solid-js";

export type Theme = "light" | "dark";

const STORAGE_KEY = "setupmoney_theme";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const saved = localStorage.getItem(STORAGE_KEY) as Theme | null;
  if (saved === "light" || saved === "dark") {
    return saved;
  }
  if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }
  return "light";
}

const initial = getInitialTheme();
if (typeof document !== "undefined") {
  document.documentElement.setAttribute("data-theme", initial);
}

const [currentTheme, setCurrentThemeSignal] = createSignal<Theme>(initial);

export function useTheme() {
  if (typeof document !== "undefined" && !document.documentElement.hasAttribute("data-theme")) {
    document.documentElement.setAttribute("data-theme", currentTheme());
  }

  const setTheme = (theme: Theme) => {
    setCurrentThemeSignal(theme);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, theme);
      document.documentElement.setAttribute("data-theme", theme);
    }
  };

  const toggleTheme = () => {
    setTheme(currentTheme() === "dark" ? "light" : "dark");
  };

  return {
    theme: currentTheme,
    setTheme,
    toggleTheme,
  };
}
