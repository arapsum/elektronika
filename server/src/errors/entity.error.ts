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
