import { pgTable, primaryKey, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { role } from "./roles.ts";

export const permission = pgTable("permissions", {
  id: text()
    .primaryKey()
    .$defaultFn(() => createId()),
  name: varchar({ length: 255 }).unique().notNull(),
  description: text(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const rolesToPermissions = pgTable(
  "roles_to_permissions",
  {
    roleId: text("role_id")
      .references(() => role.id, { onDelete: "cascade" })
      .notNull(),
    permissionId: text("permission_id")
      .references(() => permission.id, {
        onDelete: "cascade",
      })
      .notNull(),
    assignedAt: timestamp("assigned_at", { mode: "string" }).defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.roleId, t.permissionId] })],
);

export type PermissionModel = typeof permission.$inferSelect;
export type PermissionInsertModel = typeof permission.$inferInsert;
export type RolePermissionModel = typeof rolesToPermissions.$inferSelect;
export type RolePermissionInsertModel = typeof rolesToPermissions.$inferInsert;
