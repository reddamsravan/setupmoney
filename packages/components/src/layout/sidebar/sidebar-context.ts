import { createContext, useContext, type Accessor } from "solid-js";

export interface SidebarContextValue {
  collapsed: Accessor<boolean>;
  setCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;
}

export const SidebarContext = createContext<SidebarContextValue>();

export function useSidebarContext() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebarContext must be used within a <Sidebar> component");
  }
  return context;
}
