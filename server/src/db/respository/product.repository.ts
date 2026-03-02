import { brand, category, product, type ProductInsertModel } from "@/db/schema/index.ts";
import { db } from "@/db/connection.ts";
import type { PinoLogger } from "hono-pino";
import type { PaginationQueryType } from "@/types/handler.types.ts";
import { and, count, desc, eq, isNull } from "drizzle-orm";
import type { UpdateProductType } from "@/types/product.types.ts";
import { EntityNotFound } from "@/errors/entity.error.ts";

async function create(values: ProductInsertModel, logger: PinoLogger) {
  try {
    const result = await db.insert(product).values(values).returning();

    return result[0];
  } catch (e) {
    logger.error({ error: e }, "Failed to create new product!");

    if (e instanceof Error) {
      throw new Error(`Failed to create product: ${e.message}`);
    }

    throw new Error("Failed to create product: Unkown error!");
  }
}

async function list(params: PaginationQueryType, logger: PinoLogger) {
  try {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(20, Math.max(1, params.limit || 20));
    const offset = (page - 1) * limit;

    const totalResult = await db
      .select({ count: count() })
      .from(product)
      .where(isNull(product.deletedAt));
    const totalItems = Number(totalResult[0].count || 0);

    const result = await db
      .select({
        id: product.id,
        categoryId: category.id,
        category: category.name,
        brandId: brand.id,
        brand: brand.name,
        name: product.name,
        slug: product.slug,
        description: product.description,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        deletedAt: product.deletedAt,
      })
      .from(product)
      .innerJoin(category, eq(category.id, product.categoryId))
      .innerJoin(brand, eq(brand.id, product.brandId))
      .where(isNull(product.deletedAt))
      .limit(limit)
      .offset(offset)
      .orderBy(desc(product.createdAt));

    const totalPages = Math.ceil(totalItems / limit);
    const hasNext = totalPages > page;
    const hasPrev = page > 1;

    return {
      data: result,
      hasNext,
      hasPrev,
      limit,
      page,
      totalItems,
      totalPages,
    };
  } catch (e) {
    logger.error({ error: e }, "products fetching failed");

    if (e instanceof Error) {
      throw new Error(`Failed to fetch products: ${e.message}`);
    }

    throw new Error("Failed to fetch products: Unkown error!");
  }
}

async function one(id: string, logger: PinoLogger) {
  try {
    const result = await db
      .select({
        id: product.id,
        categoryId: category.id,
        category: category.name,
        brandId: brand.id,
        brand: brand.name,
        name: product.name,
        slug: product.slug,
        description: product.description,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        deletedAt: product.deletedAt,
      })
      .from(product)
      .where(and(eq(product.id, id), isNull(product.deletedAt)))
      .innerJoin(category, eq(category.id, product.categoryId))
      .innerJoin(brand, eq(brand.id, product.brandId));

    if (result.length === 0) {
      throw new EntityNotFound(`Product with ID ${id} not found`);
    }

    return result[0];
  } catch (e) {
    logger.error({ error: e, id }, "product fetching failed");

    if (e instanceof Error) {
      if (e instanceof EntityNotFound) {
        throw e;
      }
      throw new Error(`Failed to fetch product: ${e.message}`);
    }

    throw new Error("Failed to fetch product: Unkown error!");
  }
}

async function update(id: string, values: UpdateProductType, logger: PinoLogger) {
  try {
    const updates: Record<string, unknown> = {};

    if (values.name) {
      updates.name = values.name;
    }

    if (values.slug) {
      updates.slug = values.slug;
    }

    if (values.description) {
      updates.description = values.description;
    }

    if (values.categoryId) {
      updates.categoryId = values.categoryId;
    }

    if (values.brandId) {
      updates.brandId = values.brandId;
    }

    const result = await db.update(product).set(updates).where(eq(product.id, id)).returning();

    return result[0];
  } catch (e) {
    logger.error({ error: e }, "product updating failed");

    if (e instanceof Error) {
      throw new Error(`Failed to update product: ${e.message}`);
    }

    throw new Error("Failed to fetch update: Unkown error!");
  }
}

async function remove(id: string, logger: PinoLogger) {
  try {
    let deletedAt = new Date();
    const result = await db
      .update(product)
      .set({ deletedAt })
      .where(eq(product.id, id))
      .returning();

    logger.info(
      { product: result[0].name, slug: result[0].slug },
      `product ${result[0].name} has been marked deleted at ${deletedAt}`,
    );

    return result[0];
  } catch (e) {
    logger.error({ error: e }, "product updating failed");

    if (e instanceof Error) {
      throw new Error(`Failed to update product: ${e.message}`);
    }

    throw new Error("Failed to fetch update: Unkown error!");
  }
}

export type ProductReturnType = Awaited<ReturnType<typeof one>>;
export type ListProductsReturnType = Awaited<ReturnType<typeof list>>;

export { create, list, one, update, remove };
