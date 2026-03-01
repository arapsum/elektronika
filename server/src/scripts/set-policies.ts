import db from "@/db/index.ts";
import {
  permission,
  role,
  type RolePermissionInsertModel,
  rolesToPermissions,
} from "@/db/schema/index.ts";
import { eq } from "drizzle-orm";

async function setAdminPolicy() {
  try {
    const adminRole = await db.select().from(role).where(eq(role.name, "admin"));

    if (!adminRole || adminRole.length === 0) {
      console.error("admin role not found");
      throw new Error("Admin role not found");
    }

    const adminRoleId = adminRole[0].id;

    const adminPolicy: RolePermissionInsertModel[] = [];

    const allPermissions = await db.select({ permissionId: permission.id }).from(permission);

    for (const permission of allPermissions) {
      adminPolicy.push({
        roleId: adminRoleId,
        permissionId: permission.permissionId,
      });
    }

    await db.insert(rolesToPermissions).values(adminPolicy).onConflictDoNothing();

    console.log("Succeessfully set admin policy");
  } catch (e) {
    console.log("Error setting admin policy: ", e);

    throw e;
  }
}

if (import.meta.filename) {
  await setAdminPolicy();

  process.exit(0);
}
