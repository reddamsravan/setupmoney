import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render } from "solid-js/web";
import { Route as rootRoute } from "../../routes/__root";
import { Route as transactionsRoute } from "../../routes/transactions";
import { Route as reportsRoute } from "../../routes/reports";
import { queryClient } from "../../query-client";
import { api } from "@setupmoney/api";

describe("Route Error Boundary Configuration", () => {
  let container: HTMLDivElement;
  let resetQueriesSpy: ReturnType<typeof vi.spyOn>;

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

  it("configures errorComponent on the root route — renders full-page h1 and resets all queries", () => {
    const errorComponent = rootRoute.options.errorComponent as any;
    expect(errorComponent).toBeDefined();

    const resetFn = vi.fn();
    const dispose = render(
      () => errorComponent({ error: new Error("Root crash"), reset: resetFn }),
      container,
    );

    expect(container.querySelector("h1")?.textContent).toMatch(/something went wrong/i);
    container.querySelector("button")?.click();
    expect(resetQueriesSpy).toHaveBeenCalledWith(); // resets all
    expect(resetFn).toHaveBeenCalledTimes(1);
    dispose();
  });

  it("configures errorComponent on transactions route and resets transactions query key on Try Again", () => {
    const errorComponent = transactionsRoute.options.errorComponent as any;
    expect(errorComponent).toBeDefined();
    expect(typeof errorComponent).toBe("function");

    const resetFn = vi.fn();
    const error = new Error("Transactions render failure");

    const dispose = render(() => errorComponent({ error, reset: resetFn }), container);

    const heading = container.querySelector("h2");
    expect(heading?.textContent).toMatch(/Failed to load section|Something went wrong/i);

    const tryAgainBtn = Array.from(container.querySelectorAll("button")).find((btn) =>
      btn.textContent?.includes("Try Again"),
    );
    expect(tryAgainBtn).toBeDefined();

    tryAgainBtn?.click();

    expect(resetQueriesSpy).toHaveBeenCalledWith({ queryKey: api.transactions.keys.all });
    expect(resetFn).toHaveBeenCalledTimes(1);

    dispose();
  });

  it("configures errorComponent on reports route and resets reports query key on Try Again", () => {
    const errorComponent = reportsRoute.options.errorComponent as any;
    expect(errorComponent).toBeDefined();
    expect(typeof errorComponent).toBe("function");

    const resetFn = vi.fn();
    const error = new Error("Reports render failure");

    const dispose = render(() => errorComponent({ error, reset: resetFn }), container);

    const heading = container.querySelector("h2");
    expect(heading?.textContent).toMatch(/Failed to load section|Something went wrong/i);

    const tryAgainBtn = Array.from(container.querySelectorAll("button")).find((btn) =>
      btn.textContent?.includes("Try Again"),
    );
    expect(tryAgainBtn).toBeDefined();

    tryAgainBtn?.click();

    expect(resetQueriesSpy).toHaveBeenCalledWith({ queryKey: api.reports.keys.all });
    expect(resetFn).toHaveBeenCalledTimes(1);

    dispose();
  });

  it("isolates route error fallback rendering to the child container without unmounting layout shell", () => {
    const errorComponent = transactionsRoute.options.errorComponent as any;
    const resetFn = vi.fn();
    const error = new Error("Render error inside transactions");

    // Simulate shell layout with sidebar and main content hosting the route errorComponent
    const dispose = render(
      () => (
        <div class="layoutShell">
          <aside class="sidebar">Sidebar Navigation</aside>
          <main class="mainContent">{errorComponent({ error, reset: resetFn })}</main>
        </div>
      ),
      container,
    );

    // Layout shell sidebar remains intact
    const sidebar = container.querySelector(".sidebar");
    expect(sidebar).not.toBeNull();
    expect(sidebar?.textContent).toBe("Sidebar Navigation");

    // Route error fallback renders inside mainContent
    const heading = container.querySelector(".mainContent h2");
    expect(heading?.textContent).toMatch(/Failed to load section/i);

    const tryAgainBtn = Array.from(container.querySelectorAll("button")).find((btn) =>
      btn.textContent?.includes("Try Again"),
    );
    expect(tryAgainBtn).toBeDefined();

    dispose();
  });
});
