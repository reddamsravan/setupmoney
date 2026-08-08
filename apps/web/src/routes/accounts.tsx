import { createFileRoute } from "@tanstack/solid-router";

export const Route = createFileRoute("/accounts")({
  component: Accounts,
});

function Accounts() {
  return (
    <div class="container">
      <h1>Accounts Placeholder</h1>
    </div>
  );
}
