import { createFileRoute } from "@tanstack/solid-router";

export const Route = createFileRoute("/transactions")({
  component: Transactions,
});

function Transactions() {
  return (
    <div class="container">
      <h1>Transactions Placeholder</h1>
    </div>
  );
}
