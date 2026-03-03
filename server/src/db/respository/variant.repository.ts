import { db } from "@/db/connection.ts";
import {
  productVariant,
  productAttribute,
  productImage,
  attributeType,
  product,
  brand,
  category,
} from "@/db/schema/index.ts";
import type { ProductVariantInsertModel, ProductImageModel } from "@/db/schema/index.ts";
import { EntityNotFound, NoUpdatesProvidedError } from "@/errors/entity.error.ts";
import type { PaginationQueryType } from "@/types/handler.types.ts";
import {
  type CreateProductVariantType,
  type UpdateProductVariantType,
} from "@/types/variant.types.ts";
import { count, desc, and, eq, inArray, isNull, sql } from "drizzle-orm";
import type { PinoLogger } from "hono-pino";

async function create(values: CreateProductVariantType, logger: PinoLogger) {
  try {
    const variantValues: ProductVariantInsertModel = {
      productId: values.productId,
      name: values.name,
      description: values.description,
      sku: values.sku,
      stockQuantity: values.stockQuantity,
      reorderThreshold: values.reorderThreshold,
      price: values.price.toString(),
    };

    const result = await db.transaction(async (tx) => {
      const [variant] = await tx.insert(productVariant).values(variantValues).returning();

      const productVariantId = variant.id;

      const productImages: ProductImageModel[] = [];

      for (const { imageUrl, altText, displayOrder } of values.images) {
        const [image] = await tx
          .insert(productImage)
          .values({
            productVariantId,
            imageUrl,
            altText,
            displayOrder,
          })
          .returning();

        productImages.push(image);
      }

      const attributeMap: Record<string, string | number | boolean> = {};

      for (const [name, value] of Object.entries(values.attributes)) {
        let attributeTypeId: string;

        let [attrType] = await tx
          .select()
          .from(attributeType)
          .where(eq(attributeType.name, name.toLowerCase().trim()));

        if (!attrType) {
          const [newAttrType] = await tx
            .insert(attributeType)
            .values({ name })
            .onConflictDoNothing()
            .returning();

          attributeTypeId = newAttrType.id;
          attrType = newAttrType;
        } else {
          attributeTypeId = attrType.id;
        }

        const [attrVal] = await tx
          .insert(productAttribute)
          .values({
            attributeTypeId,
            value: value.toString(),
            productVariantId,
          })
          .returning();

        let attribute: Record<string, unknown> = {};

        attribute[attrType.name] = attrVal.value;

        Object.assign(attributeMap, attribute);
      }

      return {
        ...variant,
        images: productImages,
        attributes: attributeMap,
      };
    });

    return result;
  } catch (e) {
    logger.error({ error: e }, "Failed to create product variant");

    if (e instanceof Error) {
      throw new Error(`Failed to create product variant: ${e.message}`);
    }

    throw new Error("Failed to create product variant: Error unkown");
  }
}

async function update(id: string, values: UpdateProductVariantType, logger: PinoLogger) {
  const {
    productId,
    description,
    name,
    sku,
    stockQuantity,
    price,
    attributes,
    images,
    isBase,
    reorderThreshold,
  } = values;

  const updates: Record<string, unknown> = {};

  if (productId) updates.productId = productId;
  if (description) updates.description = description;
  if (name) updates.name = name;
  if (sku) updates.sku = sku;
  if (stockQuantity) updates.stockQuantity = stockQuantity;
  if (reorderThreshold) updates.reorderThreshold = reorderThreshold;
  if (price) updates.price = price;
  if (isBase) updates.isBase = isBase;

  if (Object.keys(updates).length === 0 && !attributes && !images) {
    throw new NoUpdatesProvidedError("No updates provided to product variant");
  }

  try {
    const result = await db.transaction(async (tx) => {
      const [variant] = await tx
        .update(productVariant)
        .set(updates)
        .where(eq(productVariant.id, id))
        .returning();

      const variantId = variant.id;

      const productImages = [];

      if (images && images.length > 0) {
        for (const image of images) {
          if (!image.id) {
            const [imageResult] = await tx
              .insert(productImage)
              .values({
                productVariantId: variantId,
                imageUrl: image.imageUrl!,
                altText: image.altText!,
                displayOrder: image.displayOrder!,
              })
              .returning();
            productImages.push(imageResult);
          } else {
            const imageUpdates: Record<string, unknown> = {};

            if (image.imageUrl) imageUpdates.imageUrl = image.imageUrl;
            if (image.altText) imageUpdates.altText = image.altText;
            if (image.displayOrder) imageUpdates.displayOrder = image.displayOrder;

            const [imageResult] = await tx
              .update(productImage)
              .set({ productVariantId: variantId, ...imageUpdates })
              .where(eq(productImage.id, image.id))
              .returning();

            productImages.push(imageResult);
          }
        }
      }

      const attributeMap = {};

      if (attributes !== undefined && attributes !== null) {
        for (const [name, value] of Object.entries(attributes)) {
          let attributeTypeId: string;

          let [attrType] = await tx
            .select()
            .from(attributeType)
            .where(eq(attributeType.name, name.toLowerCase().trim()));

          if (!attrType) {
            const [newAttrType] = await tx
              .insert(attributeType)
              .values({ name })
              .onConflictDoNothing()
              .returning();

            attributeTypeId = newAttrType.id;
            attrType = newAttrType;
          } else {
            attributeTypeId = attrType.id;
          }

          const [attrVal] = await tx
            .insert(productAttribute)
            .values({
              attributeTypeId,
              value: value.toString(),
              productVariantId: variantId,
            })
            .returning();

          let attribute: Record<string, unknown> = {};

          attribute[attrType.name] = attrVal.value;

          Object.assign(attributeMap, attribute);
        }
      }

      return {
        ...variant,
        images: productImages,
        attributes: attributeMap,
      };
    });

    return result;
  } catch (e) {
    logger.error({ error: e, id }, "An error occurred while updating a product variants");

    if (e instanceof Error) {
      if (e instanceof NoUpdatesProvidedError) {
        throw e;
      }
      throw new Error(`Failed to updating a product variants due to ${e.message}`);
    }

    throw new Error("Failed to update a product variants: Error unkown");
  }
}

async function remove(id: string, logger: PinoLogger) {
  try {
    const [item] = await db
      .update(productVariant)
      .set({
        deletedAt: new Date(),
      })
      .where(eq(productVariant.id, id))
      .returning();

    return item;
  } catch (e) {
    logger.error({ error: e, id }, "Failed to delete product variant");

    if (e instanceof Error) {
      if (e instanceof EntityNotFound) {
        throw e;
      }
      throw new Error(`Failed to delete product variant with ID ${id}: ${e.message}`);
    }

    throw new Error(`Failed to delete product variant with ID ${id}: unkown error`);
  }
}

async function list(query: PaginationQueryType, logger: PinoLogger) {
  try {
    const page = Math.max(1, query.page || 1);
    const limit = Math.min(20, Math.max(1, query.limit || 20));
    const offset = (page - 1) * limit;

    const result = await db.transaction(async (tx) => {
      const totalResult = await tx
        .select({ count: count() })
        .from(productVariant)
        .where(isNull(productVariant.deletedAt));
      const totalItems = Number(totalResult[0]?.count || 0);

      const filteredVariants = tx.$with("filtered_variants").as(
        tx
          .select({
            id: productVariant.id,
            productId: productVariant.productId,
            sku: productVariant.sku,
            name: productVariant.name,
            price: productVariant.price,
            stockQuantity: productVariant.stockQuantity,
            reorderThreshold: productVariant.reorderThreshold,
            isBase: productVariant.isBase,
            description: productVariant.description,
            createdAt: productVariant.createdAt,
            deletedAt: productVariant.deletedAt,
            updatedAt: productVariant.updatedAt,
          })
          .from(productVariant)
          .innerJoin(product, eq(product.id, productVariant.productId))
          .where(isNull(productVariant.deletedAt))
          .orderBy(desc(productVariant.createdAt))
          .limit(limit)
          .offset(offset),
      );

      const attributeAgg = tx.$with("attribute_agg").as(
        tx
          .select({
            productVariantId: productAttribute.productVariantId,
            attributes: sql`
        jsonb_object_agg(${attributeType.name}, ${productAttribute.value})
      `.as("attributes"),
          })
          .from(productAttribute)
          .innerJoin(attributeType, eq(attributeType.id, productAttribute.attributeTypeId))
          .where(
            inArray(
              productAttribute.productVariantId,
              tx.select({ id: filteredVariants.id }).from(filteredVariants),
            ),
          )
          .groupBy(productAttribute.productVariantId),
      );

      const imageAgg = tx.$with("image_agg").as(
        tx
          .select({
            productVariantId: productImage.productVariantId,
            images: sql`
        jsonb_agg(
          jsonb_build_object(
            'url', ${productImage.imageUrl},
            'alt', ${productImage.altText},
            'order', ${productImage.displayOrder}
          )
          ORDER BY ${productImage.displayOrder}
        )
      `.as("images"),
          })
          .from(productImage)
          .where(
            inArray(
              productImage.productVariantId,
              tx.select({ id: filteredVariants.id }).from(filteredVariants),
            ),
          )
          .groupBy(productImage.productVariantId),
      );

      const result = await tx
        .with(filteredVariants, attributeAgg, imageAgg)
        .select({
          productName: product.name,
          productId: filteredVariants.productId,

          categoryId: category.id,
          categoryName: category.name,

          brandId: brand.id,
          brandName: brand.name,

          variantId: filteredVariants.id,
          sku: filteredVariants.sku,
          variantName: filteredVariants.name,
          price: filteredVariants.price,
          stockQuantity: filteredVariants.stockQuantity,
          reorderThreshold: filteredVariants.reorderThreshold,
          isBase: filteredVariants.isBase,
          createdAt: filteredVariants.createdAt,
          updatedAt: filteredVariants.updatedAt,
          deletedAt: filteredVariants.deletedAt,

          attributes: attributeAgg.attributes,
          images: imageAgg.images,
        })
        .from(filteredVariants)
        .innerJoin(product, eq(product.id, filteredVariants.productId))
        .leftJoin(category, eq(category.id, product.categoryId))
        .leftJoin(brand, eq(brand.id, product.brandId))
        .leftJoin(attributeAgg, eq(attributeAgg.productVariantId, filteredVariants.id))
        .leftJoin(imageAgg, eq(imageAgg.productVariantId, filteredVariants.id))
        .orderBy(desc(filteredVariants.createdAt));

      const totalPages = Math.ceil(totalItems / limit);
      const hasNext = totalItems > page;
      const hasPrev = page > 1;

      return {
        data: result,
        pagination: {
          page,
          limit,
          hasNext,
          hasPrev,
          totalPages,
          totalItems,
        },
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
    const result = db.transaction(async (tx) => {
      const filteredVariants = tx.$with("filtered_variants").as(
        tx
          .select({
            id: productVariant.id,
            productId: productVariant.productId,
            sku: productVariant.sku,
            name: productVariant.name,
            price: productVariant.price,
            stockQuantity: productVariant.stockQuantity,
            reorderThreshold: productVariant.reorderThreshold,
            isBase: productVariant.isBase,
            description: productVariant.description,
            createdAt: productVariant.createdAt,
            deletedAt: productVariant.deletedAt,
            updatedAt: productVariant.updatedAt,
          })
          .from(productVariant)
          .innerJoin(product, eq(product.id, productVariant.productId))
          .where(and(eq(productVariant.id, id), isNull(productVariant.deletedAt)))
          .orderBy(desc(productVariant.id)),
      );

      const attributeAgg = tx.$with("attribute_agg").as(
        tx
          .select({
            productVariantId: productAttribute.productVariantId,
            attributes: sql`
        jsonb_object_agg(${attributeType.name}, ${productAttribute.value})
      `.as("attributes"),
          })
          .from(productAttribute)
          .innerJoin(attributeType, eq(attributeType.id, productAttribute.attributeTypeId))
          .where(
            inArray(
              productAttribute.productVariantId,
              tx.select({ id: filteredVariants.id }).from(filteredVariants),
            ),
          )
          .groupBy(productAttribute.productVariantId),
      );

      const imageAgg = tx.$with("image_agg").as(
        tx
          .select({
            productVariantId: productImage.productVariantId,
            images: sql`
        jsonb_agg(
          jsonb_build_object(
            'url', ${productImage.imageUrl},
            'alt', ${productImage.altText},
            'order', ${productImage.displayOrder}
          )
          ORDER BY ${productImage.displayOrder}
        )
      `.as("images"),
          })
          .from(productImage)
          .where(
            inArray(
              productImage.productVariantId,
              tx.select({ id: filteredVariants.id }).from(filteredVariants),
            ),
          )
          .groupBy(productImage.productVariantId),
      );

      const [item] = await tx
        .with(filteredVariants, attributeAgg, imageAgg)
        .select({
          productName: product.name,
          productId: filteredVariants.productId,

          categoryId: category.id,
          categoryName: category.name,

          brandId: brand.id,
          brandName: brand.name,

          variantId: filteredVariants.id,
          sku: filteredVariants.sku,
          variantName: filteredVariants.name,
          price: filteredVariants.price,
          stockQuantity: filteredVariants.stockQuantity,
          reorderThreshold: filteredVariants.reorderThreshold,
          isBase: filteredVariants.isBase,
          createdAt: filteredVariants.createdAt,
          updatedAt: filteredVariants.updatedAt,
          deletedAt: filteredVariants.deletedAt,

          attributes: attributeAgg.attributes,
          images: imageAgg.images,
        })
        .from(filteredVariants)
        .innerJoin(product, eq(product.id, filteredVariants.productId))
        .leftJoin(category, eq(category.id, product.categoryId))
        .leftJoin(brand, eq(brand.id, product.brandId))
        .leftJoin(attributeAgg, eq(attributeAgg.productVariantId, filteredVariants.id))
        .leftJoin(imageAgg, eq(imageAgg.productVariantId, filteredVariants.id))
        .orderBy(desc(filteredVariants.id));

      if (!item) {
        throw new EntityNotFound(`Product with ID ${id} not found`);
      }

      return item;
    });

    return result;
  } catch (e) {
    logger.error({ error: e, id }, "Failed to fetch product variants");

    if (e instanceof Error) {
      if (e instanceof EntityNotFound) {
        throw e;
      }
      throw new Error(`Failed to fetch product variant with ID ${id}: ${e.message}`);
    }

    throw new Error(`Failed to fetch product variant with ID ${id}: unkown error`);
  }
}

export type ProductReturnType = Awaited<ReturnType<typeof create>>;
export type ProductVariantListReturnType = Awaited<ReturnType<typeof list>>;

export { create, list, one, remove, update };
