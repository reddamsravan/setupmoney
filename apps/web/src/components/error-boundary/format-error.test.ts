import { describe, expect, it } from "vitest";
import { getErrorMessage, getErrorStack } from "./format-error";

describe("format-error helpers", () => {
  it("extracts message and stack from Error instances", () => {
    const error = new Error("Something went wrong");
    error.stack = "Error: Something went wrong\n    at test.ts:1:1";

    expect(getErrorMessage(error)).toBe("Something went wrong");
    expect(getErrorStack(error)).toBe("Error: Something went wrong\n    at test.ts:1:1");
  });

  it("handles Error instances without stack property", () => {
    const error = new Error("No stack error");
    delete (error as any).stack;

    expect(getErrorMessage(error)).toBe("No stack error");
    expect(getErrorStack(error)).toBe("No stack error");
  });

  it("handles string errors", () => {
    expect(getErrorMessage("Direct string error")).toBe("Direct string error");
    expect(getErrorStack("Direct string error")).toBe("Direct string error");
  });

  it("extracts message from plain objects with a message property", () => {
    const obj = { message: "API failure payload", status: 500 };
    expect(getErrorMessage(obj)).toBe("API failure payload");
    expect(getErrorStack(obj)).toContain('"message": "API failure payload"');
    expect(getErrorStack(obj)).toContain('"status": 500');
  });

  it("handles plain objects without a message property by JSON stringifying", () => {
    const obj = { error: "Unauthorized", code: 401 };
    expect(getErrorMessage(obj)).toBe('{"error":"Unauthorized","code":401}');
    expect(getErrorStack(obj)).toContain('"error": "Unauthorized"');
  });

  it("extracts stack from plain objects with a custom stack property", () => {
    const obj = { message: "Custom obj", stack: "CustomStack: at module.ts:5:2" };
    expect(getErrorMessage(obj)).toBe("Custom obj");
    expect(getErrorStack(obj)).toBe("CustomStack: at module.ts:5:2");
  });

  it("handles circular objects gracefully without throwing", () => {
    const circular: Record<string, unknown> = { name: "circular" };
    circular.self = circular;

    expect(() => getErrorMessage(circular)).not.toThrow();
    expect(() => getErrorStack(circular)).not.toThrow();
    expect(getErrorMessage(circular)).toBe("[object Object]");
    expect(getErrorStack(circular)).toBe("[object Object]");
  });

  it("handles null and undefined gracefully", () => {
    expect(getErrorMessage(null)).toBe("Unknown error");
    expect(getErrorStack(null)).toBe("Unknown error");
    expect(getErrorMessage(undefined)).toBe("Unknown error");
    expect(getErrorStack(undefined)).toBe("Unknown error");
  });

  it("handles primitive non-string values", () => {
    expect(getErrorMessage(404)).toBe("404");
    expect(getErrorStack(404)).toBe("404");
    expect(getErrorMessage(false)).toBe("false");
    expect(getErrorStack(false)).toBe("false");
    expect(getErrorMessage(Symbol("custom_sym"))).toBe("Symbol(custom_sym)");
    expect(getErrorStack(Symbol("custom_sym"))).toBe("Symbol(custom_sym)");
    expect(getErrorMessage(BigInt(9007199254740991))).toBe("9007199254740991");
    expect(getErrorStack(BigInt(9007199254740991))).toBe("9007199254740991");
  });

  it("handles null-prototype objects and circular null-prototype objects without throwing", () => {
    const nullProto = Object.create(null);
    nullProto.key = "value";
    expect(getErrorMessage(nullProto)).toBe('{"key":"value"}');

    const circularNullProto = Object.create(null);
    circularNullProto.self = circularNullProto;
    expect(() => getErrorMessage(circularNullProto)).not.toThrow();
    expect(() => getErrorStack(circularNullProto)).not.toThrow();
    expect(getErrorMessage(circularNullProto)).toBe("[object Object]");
    expect(getErrorStack(circularNullProto)).toBe("[object Object]");
  });

  it("handles objects with throwing getters on message and stack gracefully", () => {
    const throwingObj = {
      get message(): string {
        throw new Error("Getter exploded");
      },
      get stack(): string {
        throw new Error("Stack getter exploded");
      },
    };

    expect(() => getErrorMessage(throwingObj)).not.toThrow();
    expect(() => getErrorStack(throwingObj)).not.toThrow();
    expect(getErrorMessage(throwingObj)).toBe("[object Object]");
    expect(getErrorStack(throwingObj)).toBe("[object Object]");
  });

  it("handles objects with throwing toString methods without unhandled exceptions", () => {
    const throwingToString: Record<string, unknown> = {
      toString() {
        throw new Error("toString exploded");
      },
    };
    throwingToString.self = throwingToString;

    expect(() => getErrorMessage(throwingToString)).not.toThrow();
    expect(() => getErrorStack(throwingToString)).not.toThrow();
    expect(getErrorMessage(throwingToString)).toBe("[object Object]");
    expect(getErrorStack(throwingToString)).toBe("[object Object]");
  });

  it("handles Error instances with empty message", () => {
    const emptyError = new Error("");
    delete (emptyError as any).stack;
    expect(getErrorMessage(emptyError)).toBe("Error");
    expect(getErrorStack(emptyError)).toBe("Error");
  });

  it("handles Error instances with empty message and custom name", () => {
    const namedError = new Error("");
    namedError.name = "CustomNetworkError";
    delete (namedError as any).stack;
    expect(getErrorMessage(namedError)).toBe("CustomNetworkError");
    expect(getErrorStack(namedError)).toBe("CustomNetworkError");
  });

  it("handles Error instances with throwing stack getters gracefully", () => {
    const err = new Error("Normal message");
    Object.defineProperty(err, "stack", {
      get() {
        throw new Error("Stack getter failed");
      },
    });
    expect(getErrorMessage(err)).toBe("Normal message");
    expect(getErrorStack(err)).toBe("Error");
  });

  it("handles hostile Proxy where all property access traps throw", () => {
    const hostile = new Proxy(
      {},
      {
        get() {
          throw new Error("Hostile get");
        },
        has() {
          throw new Error("Hostile has");
        },
        ownKeys() {
          throw new Error("Hostile ownKeys");
        },
        getOwnPropertyDescriptor() {
          throw new Error("Hostile getOwnPropertyDescriptor");
        },
      },
    );

    expect(() => getErrorMessage(hostile)).not.toThrow();
    expect(() => getErrorStack(hostile)).not.toThrow();
    expect(getErrorMessage(hostile)).toBe("[Unserializable Error]");
    expect(getErrorStack(hostile)).toBe("[Unserializable Error]");
  });

  it("handles functions, NaN, and Infinity error values", () => {
    function customFunctionError() {}
    expect(getErrorMessage(customFunctionError)).toContain("customFunctionError");
    expect(getErrorStack(customFunctionError)).toContain("customFunctionError");

    expect(getErrorMessage(NaN)).toBe("NaN");
    expect(getErrorStack(NaN)).toBe("NaN");

    expect(getErrorMessage(Infinity)).toBe("Infinity");
    expect(getErrorStack(Infinity)).toBe("Infinity");
  });
});
