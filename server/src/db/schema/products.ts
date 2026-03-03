import {
  boolean,
  decimal,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { brand, category } from "./index.ts";

export const product = pgTable(
  "products",
  {
    id: text()
      .primaryKey()
      .notNull()
      .$defaultFn(() => createId()),
    categoryId: text("category_id")
      .notNull()
      .references(() => category.id, { onDelete: "restrict" }),
    brandId: text("brand_id")
      .notNull()
      .references(() => brand.id, { onDelete: "restrict" }),
    name: varchar({ length: 255 }).notNull().unique(),
    slug: varchar({ length: 255 }).notNull().unique(),
    description: text(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    deletedAt: timestamp("deleted_at"),
  },
  (table) => [index().on(table.brandId), index().on(table.categoryId)],
);

export const productVariant = pgTable(
  "product_variants",
  {
    id: text()
      .primaryKey()
      .notNull()
      .$defaultFn(() => createId()),
    productId: text("product_id")
      .notNull()
      .references(() => product.id, { onDelete: "restrict" }),
    sku: varchar({ length: 32 }).notNull().unique(),
    name: varchar({ length: 255 }).notNull().unique(),
    price: decimal({ precision: 10, scale: 2 }).notNull(),
    description: text(),
    isBase: boolean("is_base").notNull().default(false),
    stockQuantity: integer("stock_quantity").notNull().default(0),
    reorderThreshold: integer("reorder_threshold").notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    deletedAt: timestamp("deleted_at"),
  },
  (table) => [index().on(table.productId), index().on(table.sku)],
);

export const productImage = pgTable(
  "product_images",
  {
    id: text()
      .primaryKey()
      .notNull()
      .$defaultFn(() => createId()),
    productVariantId: text("product_variant_id")
      .notNull()
      .references(() => productVariant.id, { onDelete: "cascade" }),
    imageUrl: text("image_url").notNull(),
    altText: text("alt_text").notNull(),
    displayOrder: integer("display_order").notNull(),
  },
  (table) => [index().on(table.productVariantId)],
);

export const attributeType = pgTable(
  "attribute_type",
  {
    id: text()
      .primaryKey()
      .notNull()
      .$defaultFn(() => createId()),
    name: varchar({ length: 255 }).notNull().unique(),
    dataType: varchar("data_type").notNull().default("string"),
    description: text(),
  },
  (table) => [index().on(table.name)],
);

export const productAttribute = pgTable(
  "product_attributes",
  {
    id: text()
      .primaryKey()
      .notNull()
      .$defaultFn(() => createId()),
    value: text().notNull(),
    productVariantId: text("product_variant_id")
      .notNull()
      .references(() => productVariant.id, { onDelete: "cascade" }),
    attributeTypeId: text("attribute_type_id")
      .notNull()
      .references(() => attributeType.id, { onDelete: "restrict" }),
  },
  (table) => [index().on(table.productVariantId), index().on(table.attributeTypeId)],
);

export type ProductModel = typeof product.$inferSelect;
export type ProductInsertModel = typeof product.$inferInsert;
export type ProductVariantModel = typeof productVariant.$inferSelect;
export type ProductVariantInsertModel = typeof productVariant.$inferInsert;
export type ProductImageModel = typeof productImage.$inferSelect;
export type ProductImageInsertModel = typeof productImage.$inferInsert;
export type AttributeTypeModel = typeof attributeType.$inferSelect;
export type AttributeTypeInsertModel = typeof attributeType.$inferInsert;
export type ProductAttributeModel = typeof productAttribute.$inferSelect;
export type ProductAttributeInsertModel = typeof productAttribute.$inferInsert;
