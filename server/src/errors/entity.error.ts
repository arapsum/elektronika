import { type ErrorResponseType } from "@/types/error.types.ts";

export class EntityNotFound extends Error {
  name: string;
  constructor(message: string = "Entity not found") {
    super(message);
    this.name = "EntityNotFound";
  }

  public responseBody() {
    const response: ErrorResponseType = {
      code: "ENTITY_NOT_FOUND",
      message: this.message,
    };

    return response;
  }
}

export class NoUpdatesProvidedError extends Error {
  constructor(message: string = "No updates provided") {
    super(message);
  }

  public responseBody() {
    const response: ErrorResponseType = {
      code: "UPDATE_NOT_PROVIDED",
      message: this.message,
    };

    return response;
  }
}

export class SchemaValidationError extends Error {
  name: string;
  issues: Record<string, string>;
  constructor(issues: Record<string, string>) {
    super("Validation error occurred");
    this.name = "SchemaValidationError";
    this.issues = issues;
  }

  public responseBody(): ErrorResponseType {
    return {
      code: "VALIDATION_ERROR",
      message: this.message,
    };
  }
}
