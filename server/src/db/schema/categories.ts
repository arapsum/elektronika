import { foreignKey, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

export const category = pgTable(
  "categories",
  {
    id: text()
      .primaryKey()
      .notNull()
      .$defaultFn(() => createId()),
    name: varchar({ length: 255 }).notNull().unique(),
    slug: varchar({ length: 255 }).notNull().unique(),
    icon: varchar({ length: 255 }).notNull(),
    description: text(),
    parentId: text("parent_id"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    deletedAt: timestamp("deleted_at"),
  },
  (table) => [foreignKey({ columns: [table.parentId], foreignColumns: [table.id] })],
);

export type CategoryModel = typeof category.$inferSelect;
export type CategoryInsertModel = typeof category.$inferInsert;
