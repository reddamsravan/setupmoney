import type { Component, JSX } from "solid-js";
import styles from "./sidebar.module.css";

export interface SidebarFooterProps {
  children?: JSX.Element;
}

export const SidebarFooter: Component<SidebarFooterProps> = (props) => {
  return <div class={styles.footer}>{props.children}</div>;
};
