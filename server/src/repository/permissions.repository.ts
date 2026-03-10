import { db } from "@/db/connection.ts";
import { permission, rolesToPermissions } from "@/db/schema/permissions.ts";
import { eq } from "drizzle-orm";
import { usersToRoles } from "@/db/schema/roles.ts";

async function findUserPermissions(userId: string) {
  try {
    const userPermissions = await db
      .selectDistinct({ name: permission.name })
      .from(permission)
      .innerJoin(rolesToPermissions, eq(rolesToPermissions.permissionId, permission.id))
      .innerJoin(usersToRoles, eq(usersToRoles.roleId, rolesToPermissions.roleId))
      .where(eq(usersToRoles.userId, userId));

    return userPermissions;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get user ${userId} permissions: ${error.message}`);
    }

    throw new Error(`Failed to get user ${userId} permissions: Error unkown`);
  }
}

export type FindUserPermissionsReturnType = Awaited<ReturnType<typeof findUserPermissions>>;

export { findUserPermissions };
