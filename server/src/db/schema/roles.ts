import { pgTable, primaryKey, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { user } from "./auth.ts";

export const role = pgTable("roles", {
  id: text()
    .primaryKey()
    .$defaultFn(() => createId()),
  name: varchar({ length: 50 }).unique().notNull(),
  description: text(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const usersToRoles = pgTable(
  "user_to_roles",
  {
    userId: text("user_id")
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),
    roleId: text("role_id")
      .references(() => role.id, { onDelete: "cascade" })
      .notNull(),
    assignedAt: timestamp("assigned_at").defaultNow().notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.roleId] })],
);

export type RoleModel = typeof role.$inferSelect;
export type RoleInsertModel = typeof role.$inferInsert;
export type UserRoleInsertModel = typeof usersToRoles.$inferInsert;
export type UserRoleModel = typeof usersToRoles.$inferSelect;
