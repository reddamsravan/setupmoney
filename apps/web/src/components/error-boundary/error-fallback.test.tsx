import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render } from "solid-js/web";
import { ErrorFallback } from "./error-fallback";
import { queryClient } from "../../query-client";

describe("ErrorFallback", () => {
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

  // ── Rendering ──────────────────────────────────────────────────────────────

  it("renders h1 heading and full-page container for variant=full-page", () => {
    const dispose = render(
      () => <ErrorFallback error={new Error("Root crash")} reset={vi.fn()} variant="full-page" />,
      container,
    );

    const heading = container.querySelector("h1");
    expect(heading).not.toBeNull();
    expect(heading?.textContent).toMatch(/something went wrong/i);
    dispose();
  });

  it("renders h2 heading and route container for variant=route (default)", () => {
    const dispose = render(
      () => <ErrorFallback error={new Error("Route crash")} reset={vi.fn()} />,
      container,
    );

    const heading = container.querySelector("h2");
    expect(heading).not.toBeNull();
    expect(heading?.textContent).toMatch(/failed to load/i);
    dispose();
  });

  it("renders Try Again button and Go to Dashboard link in both variants", () => {
    const dispose = render(
      () => <ErrorFallback error={new Error("err")} reset={vi.fn()} />,
      container,
    );

    const btn = Array.from(container.querySelectorAll("button")).find((b) =>
      b.textContent?.includes("Try Again"),
    );
    const link = Array.from(container.querySelectorAll("a")).find((a) =>
      a.textContent?.includes("Go to Dashboard"),
    );
    expect(btn).toBeDefined();
    expect(link).toBeDefined();
    expect(link?.getAttribute("href")).toBe("/dashboard");
    dispose();
  });

  // ── Reset behaviour ────────────────────────────────────────────────────────

  it("resets all queries when variant=full-page and no queryKeys", () => {
    const resetFn = vi.fn();
    const dispose = render(
      () => <ErrorFallback error={new Error("e")} reset={resetFn} variant="full-page" />,
      container,
    );

    container.querySelector("button")?.click();

    expect(resetQueriesSpy).toHaveBeenCalledTimes(1);
    expect(resetQueriesSpy).toHaveBeenCalledWith(); // no filter = reset all
    expect(resetFn).toHaveBeenCalledTimes(1);
    dispose();
  });

  it("resets scoped queryKeys when provided (route variant)", () => {
    const resetFn = vi.fn();
    const keys = [
      ["transactions", "all"],
      ["transactions", "list"],
    ];
    const dispose = render(
      () => <ErrorFallback error={new Error("e")} reset={resetFn} queryKeys={keys} />,
      container,
    );

    container.querySelector("button")?.click();

    expect(resetQueriesSpy).toHaveBeenCalledTimes(2);
    expect(resetQueriesSpy).toHaveBeenNthCalledWith(1, { queryKey: keys[0] });
    expect(resetQueriesSpy).toHaveBeenNthCalledWith(2, { queryKey: keys[1] });
    expect(resetFn).toHaveBeenCalledTimes(1);
    dispose();
  });

  it("only calls reset() (no query reset) when variant=route and no queryKeys", () => {
    const resetFn = vi.fn();
    const dispose = render(
      () => <ErrorFallback error={new Error("e")} reset={resetFn} />,
      container,
    );

    container.querySelector("button")?.click();

    expect(resetQueriesSpy).not.toHaveBeenCalled();
    expect(resetFn).toHaveBeenCalledTimes(1);
    dispose();
  });

  it("skips null/undefined entries inside queryKeys without crashing", () => {
    const resetFn = vi.fn();
    const keys = [undefined as any, ["transactions", "all"], null as any];
    const dispose = render(
      () => <ErrorFallback error={new Error("e")} reset={resetFn} queryKeys={keys} />,
      container,
    );

    container.querySelector("button")?.click();

    expect(resetQueriesSpy).toHaveBeenCalledTimes(1);
    expect(resetQueriesSpy).toHaveBeenCalledWith({ queryKey: ["transactions", "all"] });
    dispose();
  });

  it("handles missing reset callback gracefully", () => {
    const dispose = render(
      () => <ErrorFallback error={new Error("e")} reset={undefined as any} variant="full-page" />,
      container,
    );
    expect(() => container.querySelector("button")?.click()).not.toThrow();
    dispose();
  });

  it("handles resetQueries rejection without throwing uncaught errors", () => {
    resetQueriesSpy.mockRejectedValueOnce(new Error("reset failed"));
    const resetFn = vi.fn();
    const dispose = render(
      () => (
        <ErrorFallback
          error={new Error("e")}
          reset={resetFn}
          queryKeys={[["transactions", "all"]]}
        />
      ),
      container,
    );
    expect(() => container.querySelector("button")?.click()).not.toThrow();
    expect(resetFn).toHaveBeenCalledTimes(1);
    dispose();
  });

  // ── DEV mode ───────────────────────────────────────────────────────────────

  it("renders <details> with error stack in DEV mode", () => {
    (import.meta.env as any).DEV = true;
    const error = new Error("boom");
    error.stack = "Error: boom\n    at Comp (foo.tsx:5:3)";
    const dispose = render(() => <ErrorFallback error={error} reset={vi.fn()} />, container);
    const details = container.querySelector("details");
    expect(details).not.toBeNull();
    expect(details?.textContent).toContain("boom");
    expect(details?.textContent).toContain("foo.tsx:5:3");
    dispose();
    (import.meta.env as any).DEV = false;
  });

  it("omits <details> in PROD mode", () => {
    (import.meta.env as any).DEV = false;
    const dispose = render(
      () => <ErrorFallback error={new Error("prod")} reset={vi.fn()} />,
      container,
    );
    expect(container.querySelector("details")).toBeNull();
    dispose();
  });

  it("handles non-Error string throws gracefully", () => {
    (import.meta.env as any).DEV = true;
    const dispose = render(
      () => <ErrorFallback error={"string error" as any} reset={vi.fn()} />,
      container,
    );
    expect(container.textContent).toContain("string error");
    dispose();
    (import.meta.env as any).DEV = false;
  });

  it("handles circular non-Error objects without crashing", () => {
    (import.meta.env as any).DEV = true;
    const circular: Record<string, unknown> = { code: "BOOM" };
    circular.self = circular;
    const dispose = render(
      () => <ErrorFallback error={circular as any} reset={vi.fn()} />,
      container,
    );
    expect(container.querySelector("details")).not.toBeNull();
    dispose();
    (import.meta.env as any).DEV = false;
  });

  it("reactively updates error details when error prop changes", async () => {
    (import.meta.env as any).DEV = true;
    const { createSignal } = await import("solid-js");
    const [err, setErr] = createSignal(new Error("initial"));
    const dispose = render(() => <ErrorFallback error={err()} reset={() => {}} />, container);
    expect(container.querySelector("details")?.textContent).toContain("initial");
    setErr(new Error("updated"));
    expect(container.querySelector("details")?.textContent).toContain("updated");
    dispose();
    (import.meta.env as any).DEV = false;
  });
});
