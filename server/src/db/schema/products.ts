import {
  boolean,
  decimal,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { brandTable, categoryTable } from "./index.ts";

export type SpecificationEntry = {
  value: string;
  icon?: string;
  deriveFromAttribute?: string;
  isKeySpec?: boolean;
};

export type ProductSpecification = Record<string, Record<string, SpecificationEntry>>;

export const productTable = pgTable(
  "products",
  {
    id: varchar({ length: 255 })
      .primaryKey()
      .notNull()
      .$defaultFn(() => createId()),
    categoryId: text("category_id")
      .notNull()
      .references(() => categoryTable.id, { onDelete: "restrict" }),
    brandId: text("brand_id")
      .notNull()
      .references(() => brandTable.id, { onDelete: "restrict" }),
    name: varchar({ length: 255 }).notNull().unique(),
    slug: varchar({ length: 255 }).notNull().unique(),
    model: varchar({ length: 255 }).notNull(),
    description: text(),
    specifications: jsonb().$type<ProductSpecification>().default({}),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    deletedAt: timestamp("deleted_at"),
  },
  (t) => [index().on(t.categoryId), index().on(t.brandId)],
);

export type OptionAttributes = Record<string, string>;

export const productOptionsTable = pgTable("product_options", {
  id: varchar({ length: 255 })
    .primaryKey()
    .notNull()
    .$defaultFn(() => createId()),
  productId: text("product_id")
    .notNull()
    .references(() => productTable.id, { onDelete: "restrict" }),
  attributes: jsonb().$type<OptionAttributes>().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const productVariantTable = pgTable(
  "product_variants",
  {
    id: varchar({ length: 255 })
      .primaryKey()
      .notNull()
      .$defaultFn(() => createId()),
    optionId: varchar("option_id", { length: 255 })
      .notNull()
      .references(() => productOptionsTable.id, { onDelete: "restrict" }),
    sku: varchar({ length: 255 }).notNull(),
    price: decimal().notNull(),
    quantity: integer("stock_quantity").notNull().default(0),
    reorderThreshold: integer("reorder_threshold").notNull().default(0),
    isBase: boolean("is_default").notNull().default(false),
    createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date().toDateString()),
  },
  (t) => [index().on(t.optionId), index().on(t.sku)],
);

export const productGalleryTable = pgTable(
  "product_gallery",
  {
    id: varchar()
      .primaryKey()
      .notNull()
      .$defaultFn(() => createId()),
    productId: varchar("product_id")
      .notNull()
      .references(() => productTable.id),
    imageLink: text("image_link").notNull(),
    displayOrder: integer("display_order").notNull(),
    altText: text("alt_text"),
  },
  (t) => [index().on(t.productId)],
);

export type Product = typeof productTable.$inferSelect;
export type NewProduct = typeof productTable.$inferInsert;
export type ProductGallery = typeof productGalleryTable.$inferSelect;
export type NewProductGallery = typeof productGalleryTable.$inferInsert;
export type ProductOption = typeof productOptionsTable.$inferSelect;
export type NewProductOption = typeof productOptionsTable.$inferInsert;
export type ProductVariant = typeof productVariantTable.$inferSelect;
export type NewProductVariant = typeof productVariantTable.$inferInsert;
