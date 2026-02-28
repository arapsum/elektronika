import { db } from "@/db/connection.ts";
import { role, usersToRoles } from "@/db/schema/roles.ts";
import { auth } from "@/lib/auth.ts";
import { eq } from "drizzle-orm";

type RegisterUserModel = {
  name: string;
  email: string;
  password: string;
};

export async function seedAdmin(data: RegisterUserModel) {
  try {
    const result = await auth.api.signUpEmail({
      body: data,
    });

    if (!result.user) {
      console.error("Failed to seed admin user");
      throw new Error("Failed to seed admin user");
    }

    const adminRole = await db.select().from(role).where(eq(role.name, "admin"));

    if (!adminRole || adminRole.length === 0) {
      console.error("admin role not found");
      throw new Error("Admin role not found");
    }

    const adminUser = result.user;

    await db.insert(usersToRoles).values({
      userId: adminUser.id,
      roleId: adminRole[0].id,
    });

    console.log("Admin created successfully");
  } catch (e) {
    console.error("An error occurred when seeding admin user: ", e);

    throw e;
  }
}

if (import.meta.filename) {
  const params: RegisterUserModel = {
    name: process.env.ADMIN_NAME || "System Administrator",
    email: process.env.ADMIN_EMAIL || "admin@example.com",
    password: process.env.ADMIN_PASSWORD || "ChangeMe123!",
  };

  await seedAdmin(params);

  process.exit(0);
}
