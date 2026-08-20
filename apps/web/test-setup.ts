import { beforeAll, afterEach, afterAll } from "vitest";
import { server } from "@setupmoney/mock-service/node";

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
