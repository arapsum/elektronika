import db from "@/db/index.ts";
import { permission, type PermissionInsertModel } from "@/db/schema/permissions.ts";

const corePermissions: PermissionInsertModel[] = [
  // user table permissions
  { name: "user:read", description: "view users" },
  { name: "user:create", description: "create users" },
  { name: "user:update", description: "update user details" },
  { name: "user:delete", description: "delete users" },
  { name: "user:ban", description: "ban users" },
  //  roles table policy
  { name: "role:read", description: "read roles" },
  { name: "role:create", description: "create roles" },
  { name: "role:update", description: "update role details" },
  { name: "role:delete", description: "delete roles" },
  { name: "role:assign", description: "assign roles to users" },
  //  permissions table policy
  { name: "permission:read", description: "read permission" },
  { name: "permission:create", description: "create permission" },
  { name: "permission:update", description: "update permission details" },
  { name: "permission:delete", description: "delete permission" },
  { name: "permission:assign", description: "assign permissions to roles" },
];

async function seedCorePermissions(permissions: PermissionInsertModel[]) {
  try {
    await db.insert(permission).values(permissions);

    console.log("Seeding core permissions succeeded!");
  } catch (e) {
    console.log("Error seeding core permissions model: ", e);

    throw e;
  }
}

if (import.meta.filename) {
  await seedCorePermissions(corePermissions);

  process.exit(0);
}
