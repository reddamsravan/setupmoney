import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render } from "solid-js/web";
import {
  createRouter,
  createRootRoute,
  createRoute,
  createMemoryHistory,
  RouterProvider,
  Outlet,
} from "@tanstack/solid-router";
import { ErrorFallback } from "./error-fallback";
import { queryClient } from "../../query-client";
import { api } from "@setupmoney/api";

describe("TanStack Router End-to-End Error Boundary Integration", () => {
  let container: HTMLDivElement;
  let resetQueriesSpy: any;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    resetQueriesSpy = vi.spyOn(queryClient, "resetQueries").mockImplementation(async () => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    if (container.parentElement) {
      document.body.removeChild(container);
    }
  });

  it("catches errors in child route with ErrorFallback while root layout persists", async () => {
    let throwError = true;

    const rootRoute = createRootRoute({
      component: () => (
        <div class="root-layout">
          <nav class="sidebar">App Sidebar</nav>
          <main class="content">
            <Outlet />
          </main>
        </div>
      ),
      errorComponent: (props) => <ErrorFallback variant="full-page" {...props} />,
    });

    const transactionsRoute = createRoute({
      getParentRoute: () => rootRoute,
      path: "/transactions",
      component: () => {
        if (throwError) {
          throw new Error("Simulated transactions component crash");
        }
        return <div class="transactions-view">Transactions Loaded Successfully</div>;
      },
      errorComponent: (props) => (
        <ErrorFallback {...props} queryKeys={[api.transactions.keys.all]} />
      ),
    });

    const routeTree = rootRoute.addChildren([transactionsRoute]);
    const history = createMemoryHistory({ initialEntries: ["/transactions"] });
    const router = createRouter({ routeTree, history });

    const dispose = render(() => <RouterProvider router={router} />, container);

    await router.load();

    // Verify root layout persists
    const sidebar = container.querySelector(".sidebar");
    expect(sidebar).not.toBeNull();
    expect(sidebar?.textContent).toBe("App Sidebar");

    // Verify ErrorFallback rendered inside content area
    const heading = container.querySelector(".content h2");
    expect(heading).not.toBeNull();
    expect(heading?.textContent).toMatch(/Failed to load section/i);

    // Verify "Try Again" resets scoped transactions query
    const tryAgainBtn = Array.from(container.querySelectorAll("button")).find((btn) =>
      btn.textContent?.includes("Try Again"),
    );
    expect(tryAgainBtn).toBeDefined();

    throwError = false;
    tryAgainBtn?.click();

    expect(resetQueriesSpy).toHaveBeenCalledWith({ queryKey: api.transactions.keys.all });

    dispose();
  });

  it("catches errors in root route without child boundary using ErrorFallback full-page variant", async () => {
    const rootRoute = createRootRoute({
      component: () => (
        <div class="root-layout">
          <Outlet />
        </div>
      ),
      errorComponent: (props) => <ErrorFallback variant="full-page" {...props} />,
    });

    const unhandledCrashRoute = createRoute({
      getParentRoute: () => rootRoute,
      path: "/unhandled",
      component: () => {
        throw new Error("Unhandled root crash");
      },
    });

    const routeTree = rootRoute.addChildren([unhandledCrashRoute]);
    const history = createMemoryHistory({ initialEntries: ["/unhandled"] });
    const router = createRouter({ routeTree, history });

    const dispose = render(() => <RouterProvider router={router} />, container);

    await router.load();

    // ErrorFallback variant=full-page renders full-page error with h1
    const heading = container.querySelector("h1");
    expect(heading).not.toBeNull();
    expect(heading?.textContent).toMatch(/Something went wrong/i);

    // Verify "Try Again" resets all queries
    const tryAgainBtn = Array.from(container.querySelectorAll("button")).find((btn) =>
      btn.textContent?.includes("Try Again"),
    );
    expect(tryAgainBtn).toBeDefined();

    tryAgainBtn?.click();

    expect(resetQueriesSpy).toHaveBeenCalledWith(); // Resets all queries

    dispose();
  });
});
