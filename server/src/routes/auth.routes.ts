import ValidationError from "@/errors/validation.error.ts";
import { createRouter } from "@/lib/app.ts";
import { auth } from "@/lib/auth.ts";
import { SignInSchema, SignUpSchema } from "@/types/auth.types.ts";
import { zValidator } from "@hono/zod-validator";

const app = createRouter();

app.post(
  "/sign-up/email",
  zValidator("json", SignUpSchema, (result, _) => {
    if (!result.success) {
      throw new ValidationError(result.error.issues);
    }
  }),
  async (c) => {
    const parsed = c.req.valid("json");

    const { response, headers } = await auth.api.signUpEmail({
      returnHeaders: true,
      body: parsed,
    });

    const cookies = headers.get("set-cookie");

    if (cookies) {
      c.res.headers.append("set-cookie", cookies);
    }

    return c.json(
      {
        message: "Account created successfully!",
        ...response,
      },
      201,
    );
  },
);

app.post(
  "/sign-in/email",
  zValidator("json", SignInSchema, (result, _) => {
    if (!result.success) {
      throw new ValidationError(result.error.issues);
    }
  }),
  async (c) => {
    const parsed = c.req.valid("json");

    const { response, headers } = await auth.api.signInEmail({
      returnHeaders: true,
      body: parsed,
    });

    const cookies = headers.get("set-cookie");

    if (cookies) {
      c.res.headers.append("set-cookie", cookies);
    }

    return c.json(
      {
        message: "Login success!",
        ...response,
      },
      200,
    );
  },
);

app.on(["POST", "GET"], "/*", (c) => auth.handler(c.req.raw));

export default {
  path: "/auth",
  handler: app,
};
