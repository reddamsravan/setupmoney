import { createFileRoute } from "@tanstack/solid-router";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  return (
    <div class="container">
      <h1>Dashboard Placeholder</h1>
    </div>
  );
}
