import { createSignal, onMount, onCleanup, For, Show, type Component } from "solid-js";
import { Link, useLocation } from "@tanstack/solid-router";
import { Sidebar } from "@setupmoney/components";
import { SHORTCUTS, registerShortcutListener } from "@setupmoney/utils";
import LayoutDashboard from "lucide-solid/icons/layout-dashboard";
import Receipt from "lucide-solid/icons/receipt";
import Wallet from "lucide-solid/icons/wallet";
import PiggyBank from "lucide-solid/icons/piggy-bank";
import Target from "lucide-solid/icons/target";
import LineChart from "lucide-solid/icons/line-chart";
import BarChart3 from "lucide-solid/icons/bar-chart-3";
import styles from "./navigation.module.css";

export interface NavItemDef {
  to: string;
  label: string;
  icon: Component<{ size?: number | string; class?: string }>;
}

export const NAV_ITEMS: NavItemDef[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/transactions", label: "Transactions", icon: Receipt },
  { to: "/accounts", label: "Accounts", icon: Wallet },
  { to: "/budget", label: "Budget", icon: PiggyBank },
  { to: "/goals", label: "Goals", icon: Target },
  { to: "/assets", label: "Assets", icon: LineChart },
  { to: "/reports", label: "Reports", icon: BarChart3 },
];

export const Navigation: Component = () => {
  const [collapsed, setCollapsed] = createSignal(false);
  const location = useLocation();

  onMount(() => {
    const cleanup = registerShortcutListener(SHORTCUTS.TOGGLE_SIDEBAR, () => {
      setCollapsed((prev) => !prev);
    });
    onCleanup(cleanup);
  });

  return (
    <>
      {/* Desktop Sidebar */}
      <div class={styles.desktopSidebar}>
        <Sidebar collapsed={collapsed()} onCollapsedChange={setCollapsed}>
          <Sidebar.Header logo={<span class={styles.logo}>💸</span>}>setupmoney</Sidebar.Header>

          <Sidebar.Nav>
            <For each={NAV_ITEMS}>
              {(item) => {
                const Icon = item.icon;
                const isActive = () =>
                  location().pathname === item.to ||
                  (item.to === "/dashboard" && location().pathname === "/");

                return (
                  <Sidebar.Item active={isActive()} title={item.label}>
                    {(itemProps) => (
                      <Link to={item.to} class={itemProps.class}>
                        <Icon size={18} style={{ "flex-shrink": 0 }} />
                        <Show when={!itemProps.collapsed}>
                          <span class={styles.navLabel}>{item.label}</span>
                        </Show>
                      </Link>
                    )}
                  </Sidebar.Item>
                );
              }}
            </For>
          </Sidebar.Nav>

          <Sidebar.Footer>
            <Sidebar.Toggle />
          </Sidebar.Footer>
        </Sidebar>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav class={styles.mobileBottomNav} aria-label="Mobile Navigation">
        <For each={NAV_ITEMS}>
          {(item) => {
            const Icon = item.icon;
            const isActive = () =>
              location().pathname === item.to ||
              (item.to === "/dashboard" && location().pathname === "/");

            return (
              <Link
                to={item.to}
                class={`${styles.mobileNavItem} ${isActive() ? styles.mobileActive : ""}`}
                aria-label={item.label}
              >
                <Icon size={20} />
                <span class={styles.mobileNavLabel}>{item.label}</span>
              </Link>
            );
          }}
        </For>
      </nav>
    </>
  );
};
