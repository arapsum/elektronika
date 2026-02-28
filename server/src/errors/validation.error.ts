import type { $ZodIssue } from "zod/v4/core";
import type { ErrorResponseType } from "@/types/error.types.ts";

class ValidationError extends Error {
  issues: $ZodIssue[];
  name: string;

  constructor(issues: $ZodIssue[]) {
    super("Validation failed");
    this.name = "ValidationError";
    this.issues = issues;
  }

  public responseBody() {
    const errors: Record<string, string> = {};

    for (const issue of this.issues) {
      const field = issue.path.join(".");
      errors[field] = issue.message;
    }

    const response: ErrorResponseType = {
      code: "VALIDATION_ERROR",
      message: errors,
    };

    return response;
  }
}

export default ValidationError;
