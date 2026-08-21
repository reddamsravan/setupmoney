import { createMemoryHistory, createRouter } from "@tanstack/solid-router";
import { Route } from "./routes/index";
import { routeTree } from "./routeTree.gen";

describe("Index Route Redirect", () => {
  it("defines beforeLoad hook that triggers redirect to /dashboard", () => {
    expect(Route.options.beforeLoad).toBeDefined();
    expect(typeof Route.options.beforeLoad).toBe("function");

    expect(() => {
      Route.options.beforeLoad?.({} as any);
    }).toThrow();
  });

  it("redirects to /dashboard when landing on /", async () => {
    const history = createMemoryHistory({ initialEntries: ["/"] });
    const router = createRouter({ routeTree, history });

    await router.load();

    expect(router.state.location.pathname).toBe("/dashboard");
  });
});
