# 01: Error Boundary Components

**What to build:** Two error fallback components that together cover every crash scenario in the app:

1. **`AppErrorBoundary`** — full-page fallback wired as `errorComponent` on the root route in `__root.tsx`. "Try Again" resets all TanStack Query queries then remounts the route tree. "Go to Dashboard" navigates to `/dashboard`. In `import.meta.env.DEV` mode, a `<details>` block exposes the raw error message and stack trace. Uses raw HTML and a co-located CSS module (no `@setupmoney/components` dependency inside the error path).

2. **`RouteErrorFallback`** — reusable per-route fallback accepting a `queryKeys` prop. "Try Again" resets only the provided query keys (scoped to the errored route's domain) then remounts the route subtree. Shares the same CSS module as `AppErrorBoundary`. Called as `(props) => <RouteErrorFallback {...props} queryKeys={[...]} />` in a route's `errorComponent`.

**Blocked by:** None (can start immediately)

**Status:** done

- [x] `app-error-boundary.tsx` renders: error heading, "Try Again" button (resets all queries + `reset()`), "Go to Dashboard" link, dev-only `<details>` with error message + stack
- [x] `route-error-fallback.tsx` renders: error heading, "Try Again" button (resets scoped `queryKeys` + `reset()`), "Go to Dashboard" link, dev-only `<details>`
- [x] Co-located `app-error-boundary.module.css` covers both components' layout and typography
- [x] `AppErrorBoundary` is set as `errorComponent` on the root route in `__root.tsx`
- [x] Unit tests cover: fallback renders, "Try Again" calls correct reset, dev details block present in DEV, hidden in PROD
