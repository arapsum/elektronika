import { brandTable, type BrandInsertModel } from "@/db/schema/index.ts";
import { db } from "@/db/connection.ts";
import type { PinoLogger } from "hono-pino";
import type { PaginationQueryType } from "@/types/handler.types.ts";
import { and, count, desc, eq, isNull } from "drizzle-orm";
import type { UpdateBrandType } from "@/types/brand.types.ts";
import { EntityNotFound } from "@/errors/entity.error.ts";

async function create(values: BrandInsertModel, logger: PinoLogger) {
  try {
    const result = await db.insert(brandTable).values(values).returning();

    return result[0];
  } catch (e) {
    logger.error({ error: e }, "Failed to create new brand!");

    if (e instanceof Error) {
      throw new Error(`Failed to create brand: ${e.message}`);
    }

    throw new Error("Failed to create brand: Unkown error!");
  }
}

async function list(params: PaginationQueryType, logger: PinoLogger) {
  try {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(20, Math.max(1, params.limit || 20));
    const offset = (page - 1) * limit;

    const totalResult = await db
      .select({ count: count() })
      .from(brandTable)
      .where(isNull(brandTable.deletedAt));
    const totalItems = Number(totalResult[0].count || 0);

    const result = await db
      .select()
      .from(brandTable)
      .where(isNull(brandTable.deletedAt))
      .limit(limit)
      .offset(offset)
      .orderBy(desc(brandTable.createdAt));

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
    logger.error({ error: e }, "Brands fetching failed");

    if (e instanceof Error) {
      throw new Error(`Failed to fetch brands: ${e.message}`);
    }

    throw new Error("Failed to fetch brands: Unkown error!");
  }
}

async function one(id: string, logger: PinoLogger) {
  try {
    const result = await db
      .select()
      .from(brandTable)
      .where(and(eq(brandTable.id, id), isNull(brandTable.deletedAt)));

    if (result.length === 0) {
      throw new EntityNotFound(`Product with ID ${id} not found`);
    }

    return result[0];
  } catch (e) {
    logger.error({ error: e, id }, "Brand fetching failed");

    if (e instanceof Error) {
      if (e instanceof EntityNotFound) {
        throw e;
      }
      throw new Error(`Failed to fetch brand: ${e.message}`);
    }

    throw new Error("Failed to fetch brand: Unkown error!");
  }
}

async function update(id: string, values: UpdateBrandType, logger: PinoLogger) {
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

    if (values.logoUrl) {
      updates.icon = values.logoUrl;
    }

    const result = await db
      .update(brandTable)
      .set(updates)
      .where(eq(brandTable.id, id))
      .returning();

    return result[0];
  } catch (e) {
    logger.error({ error: e }, "brand updating failed");

    if (e instanceof Error) {
      throw new Error(`Failed to update brand: ${e.message}`);
    }

    throw new Error("Failed to fetch update: Unkown error!");
  }
}

async function remove(id: string, logger: PinoLogger) {
  try {
    let deletedAt = new Date();
    const result = await db
      .update(brandTable)
      .set({ deletedAt })
      .where(eq(brandTable.id, id))
      .returning();

    logger.info(
      { brand: result[0].name, slug: result[0].slug },
      `Brand ${result[0].name} has been marked deleted at ${deletedAt}`,
    );

    return result[0];
  } catch (e) {
    logger.error({ error: e }, "brand updating failed");

    if (e instanceof Error) {
      throw new Error(`Failed to update brand: ${e.message}`);
    }

    throw new Error("Failed to fetch update: Unkown error!");
  }
}

export type FetchListBrandsReturnType = Awaited<ReturnType<typeof list>>;

export { create, list, one, update, remove };
