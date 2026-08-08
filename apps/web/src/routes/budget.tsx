import { createFileRoute } from "@tanstack/solid-router";

export const Route = createFileRoute("/budget")({
  component: Budget,
});

function Budget() {
  return (
    <div class="container">
      <h1>Budget Placeholder</h1>
    </div>
  );
}
