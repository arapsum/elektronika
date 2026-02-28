import { Hono } from "hono";
import { type PinoLogger, pinoLogger } from "hono-pino";
import { requestId } from "hono/request-id";
import pino from "pino";
import { errorHandler, notFoundHandler } from "@/middlewares/errors.middlewares.ts";
import { cors } from "hono/cors";

export interface AppBindings {
  Variables: {
    logger: PinoLogger;
    requestId: string;
  };
}

export function createRouter() {
  return new Hono<AppBindings>({ strict: false });
}

export default function createApp() {
  const app = createRouter();

  app.use(
    "*",
    cors({
      origin: "http://localhost:4321",
      allowMethods: ["POST", "GET", "OPTIONS", "DELETE", "PATCH"],
      allowHeaders: ["Content-Type", "Authorization"],
      exposeHeaders: ["Content-Length", "set-cookie"],
      maxAge: 600,
      credentials: true,
    }),
  );

  app.use(
    "*",
    pinoLogger({
      pino: pino({
        level: "debug",
        transport: {
          target: "pino-pretty",
        },
        timestamp: pino.stdTimeFunctions.unixTime,
      }),
    }),
  );
  app.use("*", requestId());

  app.notFound(notFoundHandler);
  app.onError(errorHandler);

  return app;
}
