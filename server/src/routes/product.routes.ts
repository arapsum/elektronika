import ValidationError from "@/errors/validation.error.ts";
import { createRouter } from "@/lib/app.ts";
import { requireAuth, verifyPermissions } from "@/middlewares/auth.middleware.ts";
import * as productRepository from "@/repository/product.repository.ts";
import { CreateProductSchema } from "@/types/products.types.ts";
import { zValidator } from "@hono/zod-validator";

const app = createRouter();

app.post(
  "/",
  requireAuth,
  verifyPermissions({ permissions: "product:create" }),
  zValidator("json", CreateProductSchema, (result, _) => {
    if (!result.success) {
      throw new ValidationError(result.error.issues);
    }
  }),
  async (c) => {
    const values = c.req.valid("json");
    const logger = c.get("logger");

    const created = await productRepository.create(values, logger);

    return c.json(created, 201);
  },
);

app.get("/", async (c) => {
  const { page, limit } = c.req.query();
  const logger = c.get("logger");

  const list = await productRepository.list({ page: Number(page), limit: Number(limit) }, logger);

  return c.json(list);
});

app.get("/:id", async (c) => {
  const id = c.req.param("id");
  const logger = c.get("logger");

  const list = await productRepository.one(id, logger);

  return c.json(list);
});

export default {
  path: "/products",
  handler: app,
};
