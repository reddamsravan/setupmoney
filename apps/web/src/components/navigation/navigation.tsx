import { createSignal, onMount, onCleanup, For, Show, type Component } from "solid-js";
import { Link, useLocation } from "@tanstack/solid-router";
import { Sidebar } from "@setupmoney/components";
import { SHORTCUTS, registerShortcutListener } from "@setupmoney/utils";
import { t } from "@setupmoney/i18n";
import LayoutDashboard from "lucide-solid/icons/layout-dashboard";
import ReceiptText from "lucide-solid/icons/receipt-text";
import Wallet from "lucide-solid/icons/wallet";
import PiggyBank from "lucide-solid/icons/piggy-bank";
import Target from "lucide-solid/icons/target";
import Coins from "lucide-solid/icons/coins";
import BarChart3 from "lucide-solid/icons/bar-chart-3";
import { ThemeToggle } from "../theme-toggle/theme-toggle";
import styles from "./navigation.module.css";

export interface NavItemDef {
  to: string;
  key: string;
  getLabel: () => string;
  icon: Component<{ size?: number | string; class?: string }>;
}

export const NAV_ITEMS: NavItemDef[] = [
  {
    to: "/dashboard",
    key: "dashboard",
    getLabel: () => t("common.dashboard"),
    icon: LayoutDashboard,
  },
  {
    to: "/transactions",
    key: "transactions",
    getLabel: () => t("common.transactions"),
    icon: ReceiptText,
  },
  { to: "/accounts", key: "accounts", getLabel: () => t("common.accounts"), icon: Wallet },
  { to: "/budget", key: "budget", getLabel: () => t("common.budget"), icon: PiggyBank },
  { to: "/goals", key: "goals", getLabel: () => t("common.goals"), icon: Target },
  { to: "/assets", key: "assets", getLabel: () => t("common.assets"), icon: Coins },
  { to: "/reports", key: "reports", getLabel: () => t("common.reports"), icon: BarChart3 },
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
                const label = () => item.getLabel();

                return (
                  <Sidebar.Item active={isActive()} title={label()}>
                    {(itemProps: { collapsed: boolean; class: string }) => (
                      <Link to={item.to} class={itemProps.class}>
                        <span style={{ display: "inline-flex", "flex-shrink": 0 }}>
                          <Icon size={18} />
                        </span>
                        <Show when={!itemProps.collapsed}>
                          <span class={styles.navLabel}>{label()}</span>
                        </Show>
                      </Link>
                    )}
                  </Sidebar.Item>
                );
              }}
            </For>
          </Sidebar.Nav>

          <Sidebar.Footer>
            <ThemeToggle />
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
            const label = () => item.getLabel();

            return (
              <Link
                to={item.to}
                class={`${styles.mobileNavItem} ${isActive() ? styles.mobileActive : ""}`}
                aria-label={label()}
              >
                <Icon size={20} />
                <span class={styles.mobileNavLabel}>{label()}</span>
              </Link>
            );
          }}
        </For>
      </nav>
    </>
  );
};
