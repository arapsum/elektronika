import { createRouter } from "@/lib/app.ts";
import * as categoryRespository from "@/db/respository/category.repository.ts";
import { requireAuth, verifyPermissions } from "@/middlewares/auth.middleware.ts";
import { zValidator } from "@hono/zod-validator";
import { createCategorySchema } from "@/types/category.types.ts";
import ValidationError from "@/errors/validation.error.ts";

const app = createRouter();

app.get("/", async (c) => {
  const { page, limit } = c.req.query();
  const logger = c.get("logger");

  const categories = await categoryRespository.fetchListCategories(
    { page: Number(page), limit: Number(limit) },
    logger,
  );

  return c.json(categories);
});

app.post(
  "/",
  requireAuth,
  verifyPermissions({ permissions: "category:create" }),
  zValidator("json", createCategorySchema, (result, _) => {
    if (!result.success) {
      throw new ValidationError(result.error.issues);
    }
  }),
  async (c) => {
    const params = c.req.valid("json");
    const logger = c.get("logger");

    const created = await categoryRespository.createCategory(params, logger);

    return c.json(created, 201);
  },
);

app.get("/:id", async (c) => {
  const logger = c.get("logger");
  const id = c.req.param("id");

  const category = await categoryRespository.fetchCategoryById(id, logger);

  return c.json(category);
});

export default {
  path: "/categories",
  handler: app,
};
