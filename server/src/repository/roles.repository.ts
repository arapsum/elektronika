import { db } from "@/db/connection.ts";
import { role, usersToRoles, type UserRoleInsertModel } from "@/db/schema/roles.ts";
import { eq } from "drizzle-orm";

async function assignUserARole({ userId, roleId }: UserRoleInsertModel) {
  try {
    const assigned = await db.insert(usersToRoles).values({ userId, roleId }).returning();

    return assigned;
  } catch (err) {
    console.error("An error occurred while attempting to assign role: ", err);

    if (err instanceof Error) {
      throw new Error(`An error occurred while assigning user a role: ${err.message}`);
    }

    throw new Error("An unkown error occurred while assigning a role");
  }
}

async function fetchRoleByName(name: string) {
  try {
    const roleByName = await db.select().from(role).where(eq(role.name, name.trim())).limit(1);

    return roleByName[0];
  } catch (err) {
    console.error(`An error occurred while fetching role ${name}: `, err);

    if (err instanceof Error) {
      throw new Error(`An error occurred while fetching a role: ${err.message}`);
    }

    throw new Error("An unkown error occurred while fetching a role");
  }
}

export { assignUserARole, fetchRoleByName };
