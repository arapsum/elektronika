import type { PinoLogger } from "hono-pino";
import { category, type CategoryInsertModel } from "@/db/schema/categories.ts";
import { db } from "@/db/connection.ts";
import { type PaginationQueryType } from "@/types/handler.types.ts";
import { count, desc, eq, isNull } from "drizzle-orm";
import { EntityNotFound } from "@/errors/entity.error.ts";

async function createCategory(params: CategoryInsertModel, logger: PinoLogger) {
  try {
    const result = await db.insert(category).values(params).returning();

    logger.info({ result }, "Category creation result: ");

    return result[0];
  } catch (e) {
    logger.error({ error: e }, "Category creation failed");

    if (e instanceof Error) {
      throw new Error(`Failed to create category: ${e.message}`);
    }

    throw new Error("Failed to create category: Unkown error!");
  }
}

async function fetchListCategories(params: PaginationQueryType, logger: PinoLogger) {
  try {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(100, Math.max(1, params.limit || 100));
    const offset = (page - 1) * limit;

    const totalResult = await db.select({ count: count() }).from(category);
    const totalItems = Number(totalResult[0].count || 0);

    const result = await db
      .select()
      .from(category)
      .where(isNull(category.deletedAt))
      .limit(limit)
      .offset(offset)
      .orderBy(desc(category.createdAt));

    const totalPages = Math.ceil(totalItems / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return {
      data: result,
      pagination: {
        page,
        limit,
        hasNext,
        hasPrev,
        totalItems,
        totalPages,
      },
    };
  } catch (e) {
    logger.error({ error: e }, "Category fetching failed");

    if (e instanceof Error) {
      throw new Error(`Failed to fetch categories: ${e.message}`);
    }

    throw new Error("Failed to fetch categories: Unkown error!");
  }
}

async function fetchCategoryById(id: string, logger: PinoLogger) {
  try {
    const result = await db.select().from(category).where(eq(category.id, id));

    if (result.length === 0) {
      throw new EntityNotFound(`Category with ID ${id} not found`);
    }

    return result[0];
  } catch (e) {
    logger.error({ error: e }, "Category fetching failed");

    if (e instanceof Error) {
      throw new Error(`Failed to fetch category: ${e.message}`);
    }

    throw new Error("Failed to fetch category: Unkown error!");
  }
}

export type FetchListCategoriesReturnType = Awaited<ReturnType<typeof fetchListCategories>>;

export { createCategory, fetchListCategories, fetchCategoryById };
