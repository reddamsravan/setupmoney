import type { Component, JSX } from "solid-js";
import { useSidebarContext } from "./sidebar-context";
import styles from "./sidebar.module.css";

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

export const SidebarItem: Component<SidebarItemProps> = (props) => {
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
