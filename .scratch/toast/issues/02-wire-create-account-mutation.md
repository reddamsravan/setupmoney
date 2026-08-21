# 02: Wire useCreateAccountMutation with Toast Feedback

**What to build:** Creating an account gives the user immediate feedback via the toast system — no extra wiring needed in any component that calls `mutate()`. On success, a `"Account created successfully"` toast appears. On failure, the `ApiError` message surfaces as an error toast that stays until dismissed.

This ticket also establishes the **convention for all future mutation hooks**: every mutation hook wires `addToast` in its own `onSuccess` and `onError` callbacks at creation time — never left to the calling component. Document this in a comment inside the wired hook so future contributors follow the same pattern.

**Blocked by:** 01 — Toast Store + Container

**Status:** ready-for-agent

- [ ] `useCreateAccountMutation` calls `addToast("success", "Account created successfully")` in `onSuccess`
- [ ] `useCreateAccountMutation` calls `addToast("error", error.message)` in `onError`, where `error` is the caught `ApiError`
- [ ] No calling component needs to handle toast display manually — the mutation hook is self-contained
- [ ] A comment in `use-accounts.ts` documents the convention: all future mutation hooks must wire `addToast` in `onSuccess`/`onError` directly
- [ ] All tests pass, zero TypeScript errors, lint + format clean
