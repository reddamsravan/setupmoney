import { createFileRoute } from "@tanstack/solid-router";

export const Route = createFileRoute("/about")({
  component: About,
});

function About() {
  return (
    <div>
      <h1>About</h1>
    </div>
  );
}
