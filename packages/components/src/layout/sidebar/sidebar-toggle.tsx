import type { Component, JSX } from "solid-js";
import { useSidebarContext } from "./sidebar-context";
import styles from "./sidebar.module.css";

export interface SidebarToggleProps {
  icon?: JSX.Element;
  children?: JSX.Element;
}

export const SidebarToggle: Component<SidebarToggleProps> = (props) => {
  const { collapsed, setCollapsed } = useSidebarContext();

  const handleToggle = () => {
    setCollapsed((prev) => !prev);
  };

  return (
    <button
      type="button"
      class={styles.toggle}
      onClick={handleToggle}
      aria-label={collapsed() ? "Expand sidebar" : "Collapse sidebar"}
      title={collapsed() ? "Expand sidebar" : "Collapse sidebar"}
    >
      {props.icon ?? (collapsed() ? "→" : "←")}
    </button>
  );
};
