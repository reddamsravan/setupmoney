import { createFileRoute } from "@tanstack/solid-router";

export const Route = createFileRoute("/assets")({
  component: Assets,
});

function Assets() {
  return (
    <div class="container">
      <h1>Assets Placeholder</h1>
    </div>
  );
}
