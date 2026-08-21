# 01: Toast Store + Container

**What to build:** A working toast notification system end-to-end. Calling `addToast("success" | "error", message)` from anywhere in the app causes a toast to appear in the bottom-right corner of the viewport. Success toasts auto-dismiss after 4 seconds (timer pauses while the user hovers over the toast); error toasts stay visible until the user manually dismisses them with a ✕ button. When more than 3 toasts exist simultaneously, the oldest is evicted. The toast container renders once inside `AppLayout` via a Portal mounted to `document.body`, using raw HTML and a co-located CSS module — no `@setupmoney/components` dependency inside the toast path.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] `addToast(type, message)`, `removeToast(id)`, and `clearToasts()` are exported from the toast store module as a module-level singleton (no context required)
- [ ] `ToastItem` shape: `{ id, type: "success" | "error", message, createdAt }`
- [ ] Max 3 toasts enforced — oldest is removed when a 4th is added (FIFO eviction)
- [ ] Success toasts auto-dismiss after 4 s; the timer pauses when the pointer enters the toast and resumes on pointer leave
- [ ] Error toasts have no auto-dismiss; only a manual ✕ button removes them
- [ ] Toast container renders via a SolidJS `<Portal>` to `document.body`, fixed bottom-right position
- [ ] Container is mounted once inside `AppLayout`
- [ ] Raw HTML + co-located CSS module only — zero imports from `@setupmoney/components`
- [ ] Unit tests cover: toast appears on `addToast`, FIFO eviction at max-3, success auto-dismiss fires, error toast does not auto-dismiss, hover pauses timer, ✕ button removes toast
- [ ] All tests pass, zero TypeScript errors, lint + format clean
