import { Show, type Component } from "solid-js";
import Sun from "lucide-solid/icons/sun";
import Moon from "lucide-solid/icons/moon";
import { useTheme } from "../../stores/theme";
import styles from "./theme-toggle.module.css";

export const ThemeToggle: Component = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      class={styles.themeToggle}
      onClick={toggleTheme}
      aria-label={`Switch to ${theme() === "dark" ? "light" : "dark"} theme`}
      title={`Switch to ${theme() === "dark" ? "light" : "dark"} theme`}
    >
      <Show when={theme() === "dark"} fallback={<Moon size={18} />}>
        <Sun size={18} />
      </Show>
    </button>
  );
};
