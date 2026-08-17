import type { Component, JSX } from "solid-js";
import styles from "./sidebar.module.css";

export interface SidebarNavProps {
  children?: JSX.Element;
}

export const SidebarNav: Component<SidebarNavProps> = (props) => {
  return <nav class={styles.nav}>{props.children}</nav>;
};
