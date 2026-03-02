import betterAuthErrorResponse from "@/errors/auth.error.ts";
import { EntityNotFound } from "@/errors/entity.error.ts";
import ValidationError from "@/errors/validation.error.ts";
import { APIError } from "better-auth";
import type { NotFoundHandler, ErrorHandler } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";

export const notFoundHandler: NotFoundHandler = (c) => {
  const response = {
    code: "RESOURCE_NOT_FOUND",
    message: `Path ${c.req.path} not found`,
  };

  return c.json(response, 404);
};

export const errorHandler: ErrorHandler = (err, c) => {
  const logger = c.get("logger");
  const requestId = c.get("requestId") ?? null;

  logger.error(
    {
      type: err.name,
      message: err.message,
      cause: err.cause,
      method: c.req.method,
      path: c.req.path,
      requestId,
    },
    "Request error",
  );

  if (err instanceof ValidationError) {
    return c.json(err.responseBody(), 400);
  }

  if (err instanceof EntityNotFound) {
    return c.json(err.responseBody(), 404);
  }

  if (err instanceof APIError) {
    logger.error({ error: err }, "Better auth error");
    return betterAuthErrorResponse(err, c);
  }

  const status =
    "status" in err && typeof err.status === "number" ? (err.status as ContentfulStatusCode) : 500;

  const response = {
    code: "SERVER_ERROR",
    message: "An internal server error has occurred!",
  };

  return c.json(response, status);
};
