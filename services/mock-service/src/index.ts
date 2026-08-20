import { createServer } from "node:http";
import { createMiddleware } from "@mswjs/http-middleware";
import { handlers } from "./handlers";

const port = Number(process.env.PORT) || 8080;
const app = createMiddleware(...handlers);
const server = createServer(app);

server.listen(port, () => {
  console.log(`[mock-service] HTTP server listening on http://localhost:${port}`);
});
