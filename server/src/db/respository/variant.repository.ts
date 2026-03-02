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
import type { PaginationQueryType } from "@/types/handler.types.ts";
import type { CreateProductVariantType } from "@/types/variant.types.ts";
import { count, desc, eq, inArray, isNull, sql } from "drizzle-orm";
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
        db
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
          .orderBy(desc(productVariant.id))
          .limit(limit)
          .offset(offset),
      );

      const attributeAgg = tx.$with("attribute_agg").as(
        db
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
              db.select({ id: filteredVariants.id }).from(filteredVariants),
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
              db.select({ id: filteredVariants.id }).from(filteredVariants),
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
        .orderBy(desc(filteredVariants.id));
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

export type ProductReturnType = Awaited<ReturnType<typeof create>>;

export { create, list };
