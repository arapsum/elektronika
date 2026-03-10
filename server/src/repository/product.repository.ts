import type { PaginationQueryType } from "@/types/handler.types.ts";
import type { PinoLogger } from "hono-pino";
import { db } from "@/db/connection.ts";
import {
  productOptionsTable,
  productTable,
  productVariantTable,
  productGalleryTable,
  brandTable,
  categoryTable,
  type NewProduct,
  type NewProductGallery,
  type OptionAttributes,
} from "@/db/schema/index.ts";
import type {
  UpdateProductType,
  CreateProductType,
  UpdateProductGalleryType,
  UpdateProductOptionType,
  UpdateProductVariantType,
  ProductVariantType,
} from "@/types/products.types.ts";
import { count, eq, inArray, isNull, sql } from "drizzle-orm";
import { EntityNotFound } from "@/errors/entity.error.ts";
import type { PgTransaction } from "drizzle-orm/pg-core";

async function create(params: CreateProductType, logger: PinoLogger) {
  try {
    const result = await db.transaction(async (tx) => {
      const newProduct: NewProduct = {
        ...params,
      };
      const [product] = await tx.insert(productTable).values(newProduct).returning();

      for (const image of params.images) {
        await addImage(tx, { productId: product.id, ...image }, logger);
      }

      for (const opt of params.options) {
        await addProductVariant(tx, product.id, opt, logger);
      }

      return product;
    });

    return result;
  } catch (e) {
    logger.error({ error: e }, "Failed to create new product!");

    if (e instanceof Error) {
      throw new Error(`Failed to create product: ${e.message}`);
    }

    throw new Error("Failed to create product: Unkown error!");
  }
}

async function update(id: string, params: UpdateProductType, logger: PinoLogger) {
  const { ...coreFields } = params;

  try {
    const result = await db.transaction(async (tx) => {
      let product;

      const hasCoreChanges = Object.keys(coreFields).length > 0;

      if (hasCoreChanges) {
        const [existing] = await tx
          .select()
          .from(productTable)
          .where(eq(productTable.id, id))
          .limit(1);

        if (!existing) {
          throw new EntityNotFound(`Product with id "${id}" not found`);
        }

        let updatedSpecs = existing.specifications;
        if (coreFields.specifications) {
          updatedSpecs = {
            ...existing.specifications,
            ...coreFields.specifications,
          };
        }

        coreFields.specifications = updatedSpecs ? updatedSpecs : undefined;

        const [updated] = await tx
          .update(productTable)
          .set(coreFields)
          .where(eq(productTable.id, id))
          .returning();

        if (!updated) {
          throw new EntityNotFound(`Product with id "${id}" not found`);
        }

        product = updated;
      } else {
        const [existing] = await tx
          .select()
          .from(productTable)
          .where(eq(productTable.id, id))
          .limit(1);

        if (!existing) {
          throw new EntityNotFound(`Product with id "${id}" not found`);
        }

        product = existing;
      }

      return product;
    });

    return result;
  } catch (e) {
    logger.error({ error: e }, "Failed to update product!");

    if (e instanceof Error) {
      if (e instanceof EntityNotFound) throw e;
      throw new Error(`Failed to update product: ${e.message}`);
    }

    throw new Error("Failed to update product: Unknown error!");
  }
}

async function list(query: PaginationQueryType, logger: PinoLogger) {
  const page = Math.max(1, query.page || 1);
  const limit = Math.min(20, query.limit || 20);
  const offset = (page - 1) * limit;

  try {
    const result = await db.transaction(async (tx) => {
      const totalResult = await tx
        .select({ total: count() })
        .from(productTable)
        .where(isNull(productTable.deletedAt));
      const totalItems = Number(totalResult[0].total || 0);

      const filteredProducts = tx.$with("filtered_products").as(
        tx
          .select({
            id: productTable.id,
            brandId: productTable.brandId,
            categoryId: productTable.categoryId,
            name: productTable.name,
            model: productTable.model,
            description: productTable.description,
            specifications: productTable.specifications,
            createdAt: productTable.createdAt,
            updatedAt: productTable.updatedAt,
            deletedAt: productTable.deletedAt,
          })
          .from(productTable)
          .limit(limit)
          .offset(offset)
          .orderBy(productTable.createdAt),
      );

      const optionsAggregate = tx.$with("options_aggregate").as(
        tx
          .select({
            productId: productOptionsTable.productId,
            options: sql`json_agg(
              json_build_object(
              'attributes', ${productOptionsTable.attributes},
              'sku', ${productVariantTable.sku},
              'price', ${productVariantTable.price},
              'quantity', ${productVariantTable.quantity}
              )
          )`.as("options"),
          })
          .from(productOptionsTable)
          .leftJoin(productVariantTable, eq(productOptionsTable.id, productVariantTable.optionId))
          .groupBy(productOptionsTable.productId),
      );

      const imagesAggregate = tx.$with("images_aggregate").as(
        tx
          .select({
            productId: productGalleryTable.productId,
            images: sql`
          json_agg(
            jsonb_build_object(
              'link', ${productGalleryTable.imageLink},
              'order', ${productGalleryTable.displayOrder},
              'alt', ${productGalleryTable.altText}
            )
            ORDER BY ${productGalleryTable.displayOrder}
          )
        `.as("images"),
          })
          .from(productGalleryTable)
          .where(
            inArray(
              productGalleryTable.productId,
              tx.select({ id: filteredProducts.id }).from(filteredProducts),
            ),
          )
          .groupBy(productGalleryTable.productId),
      );

      const items = await tx
        .with(filteredProducts, optionsAggregate, imagesAggregate)
        .select({
          id: filteredProducts.id,

          brandId: brandTable.id,
          brandName: brandTable.name,

          categoryId: categoryTable.id,
          categoryName: categoryTable.name,

          name: filteredProducts.name,
          model: filteredProducts.model,
          description: filteredProducts.description,
          specifications: filteredProducts.specifications,
          createdAt: filteredProducts.createdAt,
          updatedAt: filteredProducts.updatedAt,

          images: imagesAggregate.images,

          options: optionsAggregate.options,
        })
        .from(filteredProducts)
        .innerJoin(brandTable, eq(filteredProducts.brandId, brandTable.id))
        .innerJoin(categoryTable, eq(filteredProducts.categoryId, categoryTable.id))
        .leftJoin(optionsAggregate, eq(filteredProducts.id, optionsAggregate.productId))
        .leftJoin(imagesAggregate, eq(filteredProducts.id, imagesAggregate.productId));

      const products = [];

      for (const item of items) {
        const categoryTree = await tx.execute(sql`
        WITH RECURSIVE category_tree AS (
          SELECT
            id,
            name,
            parent_id,
            slug,
            0 AS depth
          FROM
            categories
            WHERE id = ${item.categoryId}
          UNION ALL
          SELECT
            c.id,
            c.name,
            c.parent_id,
            c.slug,
            ct.depth + 1
          FROM
            categories c
            JOIN category_tree ct ON c.id = ct.parent_id
            WHERE ct.depth < 10
        )
        SELECT * FROM category_tree ORDER BY depth DESC;
      `);

        let product = {
          ...item,
          categoryTree: categoryTree.rows,
        };

        products.push(product);
      }

      const totalPages = Math.ceil(totalItems / limit);
      const hasNext = totalPages > page;
      const hasPrev = page > 1;

      return {
        data: products,
        totalItems,
        page,
        totalPages,
        hasNext,
        hasPrev,
        limit,
      };
    });

    return result;
  } catch (e) {
    logger.error({ error: e }, "Failed to fetch product variants");

    if (e instanceof Error) {
      throw new Error(`Failed to fetch product variants: ${e.message}`);
    }

    throw new Error("Failed to fetch product variants: Error unkown");
  }
}

async function one(id: string, logger: PinoLogger) {
  try {
    const result = await db.transaction(async (tx) => {
      const filteredProducts = tx.$with("filtered_products").as(
        tx
          .select({
            id: productTable.id,
            brandId: productTable.brandId,
            categoryId: productTable.categoryId,
            name: productTable.name,
            model: productTable.model,
            description: productTable.description,
            specifications: productTable.specifications,
            createdAt: productTable.createdAt,
            updatedAt: productTable.updatedAt,
            deletedAt: productTable.deletedAt,
          })
          .from(productTable)
          .where(eq(productTable.id, id))
          .orderBy(productTable.createdAt),
      );

      const optionsAggregate = tx.$with("options_aggregate").as(
        tx
          .select({
            productId: productOptionsTable.productId,
            options: sql`json_agg(
              json_build_object(
              'attributes', ${productOptionsTable.attributes},
              'sku', ${productVariantTable.sku},
              'price', ${productVariantTable.price},
              'quantity', ${productVariantTable.quantity}
              )
          )`.as("options"),
          })
          .from(productOptionsTable)
          .leftJoin(productVariantTable, eq(productOptionsTable.id, productVariantTable.optionId))
          .groupBy(productOptionsTable.productId),
      );

      const imagesAggregate = tx.$with("images_aggregate").as(
        tx
          .select({
            productId: productGalleryTable.productId,
            images: sql`
          json_agg(
            jsonb_build_object(
              'link', ${productGalleryTable.imageLink},
              'order', ${productGalleryTable.displayOrder},
              'alt', ${productGalleryTable.altText}
            )
            ORDER BY ${productGalleryTable.displayOrder}
          )
        `.as("images"),
          })
          .from(productGalleryTable)
          .where(
            inArray(
              productGalleryTable.productId,
              tx.select({ id: filteredProducts.id }).from(filteredProducts),
            ),
          )
          .groupBy(productGalleryTable.productId),
      );

      const [item] = await tx
        .with(filteredProducts, optionsAggregate, imagesAggregate)
        .select({
          id: filteredProducts.id,

          brandId: brandTable.id,
          brandName: brandTable.name,

          categoryId: categoryTable.id,
          categoryName: categoryTable.name,

          name: filteredProducts.name,
          model: filteredProducts.model,
          description: filteredProducts.description,
          specifications: filteredProducts.specifications,
          createdAt: filteredProducts.createdAt,
          updatedAt: filteredProducts.updatedAt,

          images: imagesAggregate.images,

          options: optionsAggregate.options,
        })
        .from(filteredProducts)
        .innerJoin(brandTable, eq(filteredProducts.brandId, brandTable.id))
        .innerJoin(categoryTable, eq(filteredProducts.categoryId, categoryTable.id))
        .leftJoin(optionsAggregate, eq(filteredProducts.id, optionsAggregate.productId))
        .leftJoin(imagesAggregate, eq(filteredProducts.id, imagesAggregate.productId));

      if (!item) {
        throw new EntityNotFound(`Product with ID ${id} not found`);
      }

      const categoryTree = await tx.execute(sql`
        WITH RECURSIVE category_tree AS (
          SELECT
            id,
            name,
            parent_id,
            slug,
            0 AS depth
          FROM
            categories
            WHERE id = ${item.categoryId}
          UNION ALL
          SELECT
            c.id,
            c.name,
            c.parent_id,
            c.slug,
            ct.depth + 1
          FROM
            categories c
            JOIN category_tree ct ON c.id = ct.parent_id
            WHERE ct.depth < 10
        )
        SELECT * FROM category_tree ORDER BY depth DESC;
      `);

      const product = {
        ...item,
        categoryTree: categoryTree.rows,
      };

      return product;
    });

    return result;
  } catch (e) {
    logger.error({ error: e }, "Failed to fetch product with ID", id);

    if (e instanceof Error) {
      if (e instanceof EntityNotFound) {
        throw e;
      }
      throw new Error(`Failed to fetch product with ID ${id}: ${e.message}`);
    }

    throw new Error(`Failed to fetch product with ID ${id}: Error unkown`);
  }
}

async function remove(id: string, logger: PinoLogger) {
  try {
    const result = await db
      .update(productTable)
      .set({
        deletedAt: new Date(),
      })
      .where(eq(productTable.id, id))
      .returning();

    return result[0];
  } catch (e) {
    logger.error({ error: e }, "product updating failed");

    if (e instanceof Error) {
      throw new Error(`Failed to update product: ${e.message}`);
    }

    throw new Error("Failed to fetch update: Unkown error!");
  }
}

async function addImage(
  tx: PgTransaction<any, any, any>,
  newImage: NewProductGallery,
  logger: PinoLogger,
) {
  try {
    await tx.insert(productGalleryTable).values(newImage);
  } catch (e) {
    logger.error({ error: e }, "Failed to add image!");
    throw e;
  }
}

async function updateImage(
  tx: PgTransaction<any, any, any>,
  id: string,
  updateImage: UpdateProductGalleryType,
  logger: PinoLogger,
) {
  const updates: Record<string, unknown> = {};

  if (updateImage.productId) updates.productId = updateImage.productId;
  if (updateImage.imageLink) updates.imageLink = updateImage.imageLink;
  if (updateImage.altText) updates.altText = updateImage.altText;
  if (updateImage.displayOrder) updates.displayOrder = updateImage.displayOrder;

  try {
    await tx.update(productGalleryTable).set(updates).where(eq(productGalleryTable.id, id));
  } catch (e) {
    logger.error({ error: e }, "Failed to update image!");
    throw e;
  }
}

async function updateProductOption(
  tx: PgTransaction<any, any, any>,
  id: string,
  updateOption: UpdateProductOptionType,
  logger: PinoLogger,
) {
  try {
    let updateAttributes: OptionAttributes | undefined;

    const [existing] = await tx
      .select()
      .from(productOptionsTable)
      .where(eq(productOptionsTable.id, id));

    if (!existing) {
      throw new EntityNotFound("Product option not found");
    }

    const existingAttributes = existing.attributes;

    if (updateOption.attributes) {
      updateAttributes = { ...existingAttributes, ...updateOption.attributes };
    }

    const updates: Record<string, unknown> = {};

    if (updateOption.productId) updates.productId = updateOption.productId;
    if (updateAttributes) updates.attributes = updateAttributes;

    await tx.update(productOptionsTable).set(updates).where(eq(productOptionsTable.id, id));
  } catch (e) {
    logger.error({ error: e }, "Failed to update product option!");
    throw e;
  }
}

async function addProductVariant(
  tx: PgTransaction<any, any, any>,
  productId: string,
  variant: ProductVariantType,
  logger: PinoLogger,
) {
  try {
    const { sku, price, quantity, isBase, reorderThreshold, attributes } = variant;

    const [newOption] = await tx
      .insert(productOptionsTable)
      .values({
        productId,
        attributes,
      })
      .returning();

    const [newVariant] = await tx
      .insert(productVariantTable)
      .values({
        optionId: newOption.id,
        sku,
        price,
        quantity,
        isBase,
        reorderThreshold,
      })
      .returning();

    return {
      ...newVariant,
      attributes: newOption.attributes,
    };
  } catch (e) {
    logger.error({ error: e }, "Failed to add product variant!");
    throw e;
  }
}

async function updateProductVariant(
  tx: PgTransaction<any, any, any>,
  id: string,
  updateVariant: UpdateProductVariantType,
  logger: PinoLogger,
) {
  try {
    const updates: Record<string, unknown> = {};

    if (updateVariant.sku) updates.sku = updateVariant.sku;
    if (updateVariant.price) updates.price = updateVariant.price;
    if (updateVariant.quantity) updates.stock = updateVariant.quantity;
    if (updateVariant.isBase) updates.isBase = updateVariant.isBase;
    if (updateVariant.reorderThreshold) updates.reorderThreshold = updateVariant.reorderThreshold;

    await tx.update(productVariantTable).set(updates).where(eq(productVariantTable.id, id));
  } catch (e) {
    logger.error({ error: e }, "Failed to update product variant!");
    throw e;
  }
}

export {
  list,
  remove,
  create,
  one,
  updateImage,
  addImage,
  updateProductOption,
  updateProductVariant,
  update,
};
