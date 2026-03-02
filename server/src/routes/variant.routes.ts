import ValidationError from "@/errors/validation.error.ts";
import { createRouter } from "@/lib/app.ts";
import { requireAuth, verifyPermissions } from "@/middlewares/auth.middleware.ts";
import { CreateProductVariantSchema } from "@/types/variant.types.ts";
import * as variantRepository from "@/db/respository/variant.repository.ts";
import { zValidator } from "@hono/zod-validator";

const app = createRouter();

app.post(
  "/",
  requireAuth,
  verifyPermissions({ permissions: "variant:create" }),
  zValidator("json", CreateProductVariantSchema, (result, _) => {
    if (!result.success) {
      throw new ValidationError(result.error.issues);
    }
  }),
  async (c) => {
    const logger = c.get("logger");
    const values = c.req.valid("json");

    const created = await variantRepository.create(values, logger);

    return c.json(created, 201);
  },
);

app.get("/", async (c) => {
  const logger = c.get("logger");
  const { limit, page } = c.req.queries();

  const data = await variantRepository.list({ limit: Number(limit), page: Number(page) }, logger);

  return c.json(data);
});

export default {
  path: "/product-variants",
  handler: app,
};
