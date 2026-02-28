import { relations } from "drizzle-orm";
import { account, session, user } from "./auth.ts";
import { role, usersToRoles } from "./roles.ts";
import { permission, rolesToPermissions } from "./permissions.ts";

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  userToRole: many(usersToRoles),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const roleRelations = relations(role, ({ many }) => ({
  userToRole: many(usersToRoles),
  roleToPermission: many(rolesToPermissions),
}));

export const userToRoleRelations = relations(usersToRoles, ({ one }) => ({
  user: one(user, {
    fields: [usersToRoles.userId],
    references: [user.id],
  }),
  role: one(role, {
    fields: [usersToRoles.roleId],
    references: [role.id],
  }),
}));

export const permissionRelations = relations(permission, ({ many }) => ({
  roleToPermission: many(rolesToPermissions),
}));

export const roleToPermissionRelations = relations(rolesToPermissions, ({ one }) => ({
  role: one(role, {
    fields: [rolesToPermissions.roleId],
    references: [role.id],
  }),
  permission: one(permission, {
    fields: [rolesToPermissions.permissionId],
    references: [permission.id],
  }),
}));
