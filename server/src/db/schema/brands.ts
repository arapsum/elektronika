import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

export const brand = pgTable("brands", {
  id: text()
    .primaryKey()
    .notNull()
    .$defaultFn(() => createId()),
  name: varchar({ length: 255 }).notNull().unique(),
  slug: varchar({ length: 255 }).notNull().unique(),
  logoUrl: varchar("logo_url", { length: 255 }).notNull(),
  description: text(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  deletedAt: timestamp("deleted_at"),
});

export type BrandModel = typeof brand.$inferSelect;
export type BrandInsertModel = typeof brand.$inferInsert;
