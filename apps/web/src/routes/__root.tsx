import { createRootRoute, Outlet } from "@tanstack/solid-router";
import { AppLayout } from "../components/layout/app-layout";

const Root = () => (
  <AppLayout>
    <Outlet />
  </AppLayout>
);

export const Route = createRootRoute({ component: Root });
