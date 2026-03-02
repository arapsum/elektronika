import { createRouter } from "@/lib/app.ts";
import * as productRespository from "@/db/respository/product.repository.ts";
import { zValidator } from "@hono/zod-validator";
import { requireAuth, verifyPermissions } from "@/middlewares/auth.middleware.ts";
import { CreateProductSchema, UpdateProductSchema } from "@/types/product.types.ts";
import ValidationError from "@/errors/validation.error.ts";

const app = createRouter();

app.get("/", async (c) => {
  const { page, limit } = c.req.query();
  const logger = c.get("logger");

  const list = await productRespository.list({ page: Number(page), limit: Number(limit) }, logger);

  return c.json(list);
});

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

    const created = await productRespository.create(values, logger);

    return c.json(created, 201);
  },
);

app.patch(
  "/:id",
  requireAuth,
  verifyPermissions({ permissions: "product:update" }),
  zValidator("json", UpdateProductSchema, (result, _) => {
    if (!result.success) {
      throw new ValidationError(result.error.issues);
    }
  }),
  async (c) => {
    const id = c.req.param("id");
    const values = c.req.valid("json");
    const logger = c.get("logger");

    const updated = await productRespository.update(id, values, logger);

    return c.json(updated, 201);
  },
);

app.delete("/:id", requireAuth, verifyPermissions({ permissions: "product:delete" }), async (c) => {
  const id = c.req.param("id");
  const logger = c.get("logger");

  const deleted = await productRespository.remove(id, logger);

  return c.json(deleted, 200);
});

app.get("/:id", async (c) => {
  const logger = c.get("logger");
  const id = c.req.param("id");

  const category = await productRespository.one(id, logger);

  return c.json(category);
});

export default {
  path: "/products",
  handler: app,
};
