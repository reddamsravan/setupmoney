import type { Component, JSX } from "solid-js";
import { Navigation } from "../navigation/navigation";
import styles from "./app-layout.module.css";

export interface AppLayoutProps {
  children?: JSX.Element;
}

export const AppLayout: Component<AppLayoutProps> = (props) => {
  return (
    <div class={styles.layoutShell}>
      <Navigation />
      <main class={styles.mainContent}>{props.children}</main>
    </div>
  );
};
