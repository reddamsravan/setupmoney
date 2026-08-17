import { SidebarContainer } from "./sidebar-container";
import { SidebarHeader } from "./sidebar-header";
import { SidebarNav } from "./sidebar-nav";
import { SidebarItem } from "./sidebar-item";
import { SidebarToggle } from "./sidebar-toggle";
import { SidebarFooter } from "./sidebar-footer";

export const Sidebar = Object.assign(SidebarContainer, {
  Header: SidebarHeader,
  Nav: SidebarNav,
  Item: SidebarItem,
  Toggle: SidebarToggle,
  Footer: SidebarFooter,
});

export type { SidebarProps } from "./sidebar-container";
export type { SidebarHeaderProps } from "./sidebar-header";
export type { SidebarNavProps } from "./sidebar-nav";
export type { SidebarItemProps } from "./sidebar-item";
export type { SidebarToggleProps } from "./sidebar-toggle";
export type { SidebarFooterProps } from "./sidebar-footer";
