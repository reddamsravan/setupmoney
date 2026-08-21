import { createFileRoute } from "@tanstack/solid-router";
import { api } from "@setupmoney/api";
import { ErrorFallback } from "../components/error-boundary/error-fallback";

export const Route = createFileRoute("/transactions")({
  component: Transactions,
  errorComponent: (props) => <ErrorFallback {...props} queryKeys={[api.transactions.keys.all]} />,
});

function Transactions() {
  return (
    <div class="container">
      <h1>Transactions Placeholder</h1>
    </div>
  );
}
