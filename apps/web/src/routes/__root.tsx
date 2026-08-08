import { createRootRoute, Link, Outlet } from "@tanstack/solid-router";

const Root = () => (
  <div>
    <div>
      <Link to="/">Dashboard</Link>
      <Link to="/transactions">Transactions</Link>
      <Link to="/accounts">Accounts</Link>
      <Link to="/budget">Budget</Link>
      <Link to="/goals">Goals</Link>
      <Link to="/assets">Assets</Link>
      <Link to="/reports">Reports</Link>
      <Link to="/about">About</Link>
    </div>
    <Outlet />
  </div>
);

export const Route = createRootRoute({ component: Root });
