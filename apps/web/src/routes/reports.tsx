import { createFileRoute } from "@tanstack/solid-router";

export const Route = createFileRoute("/reports")({
  component: Reports,
});

function Reports() {
  return (
    <div class="container">
      <h1>Reports Placeholder</h1>
    </div>
  );
}
