import type { Component, JSX } from "solid-js";
import styles from "./sidebar.module.css";

export interface SidebarHeaderProps {
  logo?: JSX.Element;
  children?: JSX.Element;
}

export const SidebarHeader: Component<SidebarHeaderProps> = (props) => {
  return (
    <div class={styles.header}>
      {props.logo}
      <span class={styles.headerTitle}>{props.children}</span>
    </div>
  );
};
