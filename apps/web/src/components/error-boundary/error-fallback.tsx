import { Show, type Component } from "solid-js";
import type { ErrorComponentProps } from "@tanstack/solid-router";
import { queryClient } from "../../query-client";
import { getErrorStack } from "./format-error";
import styles from "./error-fallback.module.css";

export interface ErrorFallbackProps extends ErrorComponentProps {
  /** Query keys to reset on Try Again. When absent and variant is "full-page",
   *  all queries are reset. When absent and variant is "route", only reset() is called. */
  queryKeys?: readonly (readonly unknown[])[];
  /** "full-page" — min-height 100vh, h1 heading, resets all queries when no queryKeys.
   *  "route" — inset bordered panel, h2 heading. Defaults to "route". */
  variant?: "full-page" | "route";
}

export const ErrorFallback: Component<ErrorFallbackProps> = (props) => {
  const isFullPage = () => props.variant === "full-page";

  const handleTryAgain = () => {
    if (props.queryKeys && props.queryKeys.length > 0) {
      for (const queryKey of props.queryKeys) {
        if (queryKey) {
          queryClient.resetQueries({ queryKey });
        }
      }
    } else if (isFullPage()) {
      queryClient.resetQueries();
    }
    props.reset?.();
  };

  const errorStack = () => getErrorStack(props.error);

  return (
    <div class={isFullPage() ? styles.fullPageContainer : styles.routeContainer}>
      <div class={styles.card}>
        <Show when={isFullPage()} fallback={<h2 class={styles.heading}>Failed to load section</h2>}>
          <h1 class={styles.heading}>Something went wrong</h1>
        </Show>

        <p class={styles.description}>
          <Show
            when={isFullPage()}
            fallback="An error occurred while loading this view. You can try refreshing the data or navigate back to the dashboard."
          >
            An unexpected error occurred in the application. You can try again or return to the
            dashboard.
          </Show>
        </p>

        <div class={styles.actions}>
          <button type="button" class={styles.primaryButton} onClick={handleTryAgain}>
            Try Again
          </button>
          <a href="/dashboard" class={styles.secondaryLink}>
            Go to Dashboard
          </a>
        </div>

        <Show when={import.meta.env.DEV}>
          <details class={styles.details}>
            <summary class={styles.summary}>Error Details</summary>
            <pre class={styles.errorStack}>{errorStack()}</pre>
          </details>
        </Show>
      </div>
    </div>
  );
};
