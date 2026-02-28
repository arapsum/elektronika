export type ErrorResponseType = {
  code: ErrorCode;
  message: string | Record<string, string>;
};

export type ErrorCode =
  | "AUTH_REQUIRED"
  | "AUTH_INVALID"
  | "AUTH_EXPIRED"
  | "EMAIL_ALREADY_EXISTS"
  | "ENTITY_NOT_FOUND"
  | "INVALID_TOKEN"
  | "ORDER_CANNOT_CANCEL"
  | "PAYMENT_FAILED"
  | "PERMISSION_DENIED"
  | "RATE_LIMIT_EXCEEDED"
  | "RESOURCE_CONFLICT"
  | "RESOURCE_NOT_FOUND"
  | "SERVER_ERROR"
  | "STOCK_UNAVAILABLE"
  | "UPDATE_NOT_PROVIDED"
  | "VALIDATION_ERROR";
