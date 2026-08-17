import { createSignal, type Component, type JSX } from "solid-js";
import { SidebarContext } from "./sidebar-context";
import styles from "./sidebar.module.css";

export interface SidebarProps {
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  children?: JSX.Element;
}

export const SidebarContainer: Component<SidebarProps> = (props) => {
  const [internalCollapsed, setInternalCollapsed] = createSignal(props.collapsed ?? false);

  const collapsed = () => (props.collapsed !== undefined ? props.collapsed : internalCollapsed());

  const setCollapsed = (next: boolean | ((prev: boolean) => boolean)) => {
    const nextVal = typeof next === "function" ? next(collapsed()) : next;
    if (props.collapsed === undefined) {
      setInternalCollapsed(nextVal);
    }
    props.onCollapsedChange?.(nextVal);
  };

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
      <aside class={`${styles.sidebar} ${collapsed() ? styles.collapsed : ""}`}>
        {props.children}
      </aside>
    </SidebarContext.Provider>
  );
};
