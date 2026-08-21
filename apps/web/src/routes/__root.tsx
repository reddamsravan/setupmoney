import { createRootRoute, Outlet } from "@tanstack/solid-router";
import { QueryClientProvider } from "@tanstack/solid-query";
import { AppLayout } from "../components/layout/app-layout";
import { ErrorFallback } from "../components/error-boundary/error-fallback";
import { queryClient } from "../query-client";

const Root = () => (
  <QueryClientProvider client={queryClient}>
    <AppLayout>
      <Outlet />
    </AppLayout>
  </QueryClientProvider>
);

export const Route = createRootRoute({
  component: Root,
  errorComponent: (props) => <ErrorFallback variant="full-page" {...props} />,
});
