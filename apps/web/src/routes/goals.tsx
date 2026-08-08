import { createFileRoute } from "@tanstack/solid-router";

export const Route = createFileRoute("/goals")({
  component: Goals,
});

function Goals() {
  return (
    <div class="container">
      <h1>Goals Placeholder</h1>
    </div>
  );
}
