import type { RoleInsertModel } from "@/db/schema/roles.ts";
import { db } from "@/db/connection.ts";
import { role } from "@/db/schema/roles.ts";
import { exit } from "node:process";

async function seedCoreRoles(roles: RoleInsertModel[]) {
  try {
    await db.insert(role).values(roles);

    console.log("Core roles seeded successfully!");
  } catch (error) {
    console.log("An error occurred while seeding core roles: ", error);
    throw error;
  }
}

if (import.meta.filename) {
  const roles: RoleInsertModel[] = [
    { name: "admin", description: "System administrator" },
    { name: "staff", description: "Shop staff" },
    { name: "customer", description: "Regular customers" },
  ];

  await seedCoreRoles(roles);

  exit(0);
}
