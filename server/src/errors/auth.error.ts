import type { ErrorResponseType } from "@/types/error.types.ts";
import type { APIError } from "better-auth";
import type { Context } from "hono";

function betterAuthErrorResponse(error: APIError, c: Context) {
  switch (error.body?.code) {
    case "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL": {
      const response: ErrorResponseType = {
        code: "EMAIL_ALREADY_EXISTS",
        message: error.body?.message ?? "Account with email already exists. Login instead",
      };
      return c.json(response, 409);
    }

    case "INVALID_EMAIL_OR_PASSWORD": {
      const response: ErrorResponseType = {
        code: "AUTH_INVALID",
        message: error.body.message ?? "Invalid login credentials",
      };

      return c.json(response, 401);
    }

    default: {
      const response = {
        code: "SERVER_ERROR",
        message: "An internal server error has occurred. Please try again later",
      };
      return c.json(response, 500);
    }
  }
}

export default betterAuthErrorResponse;
