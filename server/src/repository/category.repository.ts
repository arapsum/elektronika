import type { PinoLogger } from "hono-pino";
import { categoryTable, type CategoryInsertModel } from "@/db/schema/categories.ts";
import { db } from "@/db/connection.ts";
import { type PaginationQueryType } from "@/types/handler.types.ts";
import { and, count, desc, eq, isNull } from "drizzle-orm";
import { EntityNotFound } from "@/errors/entity.error.ts";
import type { UpdateCategoryType } from "@/types/category.types.ts";

async function create(params: CategoryInsertModel, logger: PinoLogger) {
  try {
    const result = await db.insert(categoryTable).values(params).returning();

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

async function list(params: PaginationQueryType, logger: PinoLogger) {
  try {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(20, Math.max(1, params.limit || 50));
    const offset = (page - 1) * limit;

    const totalResult = await db
      .select({ count: count() })
      .from(categoryTable)
      .where(isNull(categoryTable.deletedAt));
    const totalItems = Number(totalResult[0].count || 0);

    const result = await db
      .select()
      .from(categoryTable)
      .where(isNull(categoryTable.deletedAt))
      .limit(limit)
      .offset(offset)
      .orderBy(desc(categoryTable.createdAt));

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

async function one(id: string, logger: PinoLogger) {
  try {
    const result = await db
      .select()
      .from(categoryTable)
      .where(and(eq(categoryTable.id, id), isNull(categoryTable.deletedAt)));

    if (result.length === 0) {
      throw new EntityNotFound(`Category with ID ${id} not found`);
    }

    return result[0];
  } catch (e) {
    logger.error({ error: e }, "Category fetching failed");

    if (e instanceof Error) {
      if (e instanceof EntityNotFound) {
        throw e;
      }
      throw new Error(`Failed to fetch category: ${e.message}`);
    }

    throw new Error("Failed to fetch category: Unkown error!");
  }
}

async function update(id: string, values: UpdateCategoryType, logger: PinoLogger) {
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

    if (values.parentId) {
      updates.parentId = values.parentId;
    }

    if (values.icon) {
      updates.icon = values.icon;
    }

    const result = await db
      .update(categoryTable)
      .set(updates)
      .where(eq(categoryTable.id, id))
      .returning();

    return result[0];
  } catch (e) {
    logger.error({ error: e }, "Category updating failed");

    if (e instanceof Error) {
      throw new Error(`Failed to update category: ${e.message}`);
    }

    throw new Error("Failed to fetch update: Unkown error!");
  }
}

async function remove(id: string, logger: PinoLogger) {
  try {
    let deletedAt = new Date();
    const result = await db
      .update(categoryTable)
      .set({ deletedAt })
      .where(eq(categoryTable.id, id))
      .returning();

    logger.info(
      { category: result[0].name, slug: result[0].slug },
      `Category ${result[0].name} has been marked deleted at ${deletedAt}`,
    );

    return result[0];
  } catch (e) {
    logger.error({ error: e }, "Category updating failed");

    if (e instanceof Error) {
      throw new Error(`Failed to update category: ${e.message}`);
    }

    throw new Error("Failed to fetch update: Unkown error!");
  }
}

export type FetchListCategoriesReturnType = Awaited<ReturnType<typeof list>>;

export { create, list, one, update, remove };
