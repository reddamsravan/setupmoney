# 02: Wire Per-Route Error Boundaries on transactions and reports

**What to build:** Add `errorComponent` to the `/transactions` and `/reports` route definitions so that a crash inside either route shows a localized, scoped error fallback rather than propagating to the root boundary and killing the whole app. Each route passes its own domain query key to `RouteErrorFallback` so "Try Again" only resets that route's cached data.

**Blocked by:** 01 — Error Boundary Components

**Status:** done

- [x] `transactions.tsx` route definition includes `errorComponent: (props) => <RouteErrorFallback {...props} queryKeys={[api.transactions.keys.all]} />`
- [x] `reports.tsx` route definition includes `errorComponent: (props) => <RouteErrorFallback {...props} queryKeys={[api.reports.keys.all]} />`
- [x] A crash in `/transactions` shows the route-level fallback; the sidebar and root layout remain mounted
- [x] A crash in `/reports` shows the route-level fallback; the sidebar and root layout remain mounted
- [x] "Try Again" on each route resets only that route's query keys, not the full query cache
