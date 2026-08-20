import { createRootRoute, Outlet } from "@tanstack/solid-router";
import { QueryClientProvider } from "@tanstack/solid-query";
import { AppLayout } from "../components/layout/app-layout";
import { queryClient } from "../query-client";

const Root = () => (
  <QueryClientProvider client={queryClient}>
    <AppLayout>
      <Outlet />
    </AppLayout>
  </QueryClientProvider>
);

export const Route = createRootRoute({ component: Root });
