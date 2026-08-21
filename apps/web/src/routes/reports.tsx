import { createFileRoute } from "@tanstack/solid-router";
import { api } from "@setupmoney/api";
import { ErrorFallback } from "../components/error-boundary/error-fallback";

export const Route = createFileRoute("/reports")({
  component: Reports,
  errorComponent: (props) => <ErrorFallback {...props} queryKeys={[api.reports.keys.all]} />,
});

function Reports() {
  return (
    <div class="container">
      <h1>Reports Placeholder</h1>
    </div>
  );
}
