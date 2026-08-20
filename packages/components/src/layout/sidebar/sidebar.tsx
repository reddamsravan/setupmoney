import {
  createContext,
  createSignal,
  useContext,
  type Accessor,
  type Component,
  type JSX,
} from "solid-js";
import styles from "./sidebar.module.css";

interface SidebarContextValue {
  collapsed: Accessor<boolean>;
  setCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;
}

const SidebarContext = createContext<SidebarContextValue>();

function useSidebarContext(): SidebarContextValue {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebarContext must be used within a <Sidebar> component");
  }
  return context;
}

export interface SidebarProps {
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  children?: JSX.Element;
}

const SidebarContainer: Component<SidebarProps> = (props) => {
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

export interface SidebarHeaderProps {
  logo?: JSX.Element;
  children?: JSX.Element;
}

const SidebarHeader: Component<SidebarHeaderProps> = (props) => {
  return (
    <div class={styles.header}>
      {props.logo}
      <span class={styles.headerTitle}>{props.children}</span>
    </div>
  );
};

export interface SidebarNavProps {
  children?: JSX.Element;
}

const SidebarNav: Component<SidebarNavProps> = (props) => {
  return <nav class={styles.nav}>{props.children}</nav>;
};

export interface SidebarItemRenderProps {
  class: string;
  active: boolean;
  collapsed: boolean;
}

export interface SidebarItemProps {
  active?: boolean;
  onClick?: (e: MouseEvent) => void;
  title?: string;
  children?: JSX.Element | ((props: SidebarItemRenderProps) => JSX.Element);
}

const SidebarItem: Component<SidebarItemProps> = (props) => {
  const { collapsed } = useSidebarContext();

  const getTitle = () => {
    if (props.title) return props.title;
    if (typeof props.children === "string") return props.children;
    return undefined;
  };

  const titleAttr = () => (collapsed() ? getTitle() : undefined);
  const ariaLabelAttr = () => getTitle();

  const itemClass = () => `${styles.item} ${props.active ? styles.active : ""}`;

  return (
    <div title={titleAttr()} aria-label={ariaLabelAttr()}>
      {typeof props.children === "function" ? (
        props.children({
          class: itemClass(),
          active: props.active ?? false,
          collapsed: collapsed(),
        })
      ) : (
        <div class={itemClass()} onClick={props.onClick}>
          {props.children}
        </div>
      )}
    </div>
  );
};

export interface SidebarToggleProps {
  icon?: JSX.Element;
  children?: JSX.Element;
}

const SidebarToggle: Component<SidebarToggleProps> = (props) => {
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

export interface SidebarFooterProps {
  children?: JSX.Element;
}

const SidebarFooter: Component<SidebarFooterProps> = (props) => {
  return <div class={styles.footer}>{props.children}</div>;
};

export const Sidebar = Object.assign(SidebarContainer, {
  Header: SidebarHeader,
  Nav: SidebarNav,
  Item: SidebarItem,
  Toggle: SidebarToggle,
  Footer: SidebarFooter,
});
