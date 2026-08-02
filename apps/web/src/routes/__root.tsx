import { createRootRoute, Link, Outlet } from "@tanstack/solid-router";

const Root = () => (
  <div>
    <div>
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
    </div>
    <Outlet />
  </div>
);

export const Route = createRootRoute({ component: Root });
