function safeStringify(value: unknown, space?: number): string {
  try {
    return JSON.stringify(value, null, space) ?? String(value);
  } catch {
    try {
      return Object.prototype.toString.call(value);
    } catch {
      return "[Unserializable Error]";
    }
  }
}

export function getErrorMessage(error: unknown): string {
  if (error === null || error === undefined) {
    return "Unknown error";
  }

  if (error instanceof Error) {
    try {
      return error.message || error.name || "Error";
    } catch {
      return "Error";
    }
  }

  if (typeof error === "object") {
    try {
      if ("message" in error && typeof (error as Record<string, unknown>).message === "string") {
        return (error as Record<string, unknown>).message as string;
      }
    } catch {
      // Getter threw, fallback to safe stringify
    }
    return safeStringify(error);
  }

  try {
    return String(error);
  } catch {
    return "[Unserializable Error]";
  }
}

export function getErrorStack(error: unknown): string {
  if (error === null || error === undefined) {
    return "Unknown error";
  }

  if (error instanceof Error) {
    try {
      return error.stack || error.message || error.name || "Error";
    } catch {
      return "Error";
    }
  }

  if (typeof error === "object") {
    try {
      if ("stack" in error && typeof (error as Record<string, unknown>).stack === "string") {
        return (error as Record<string, unknown>).stack as string;
      }
    } catch {
      // Getter threw, fallback to safe stringify
    }
    return safeStringify(error, 2);
  }

  return getErrorMessage(error);
}
