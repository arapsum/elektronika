import "dotenv/config";
import { env } from "@/env.ts";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema/index.ts";

const db = drizzle({
  connection: {
    connectionString: env.DATABASE_URL,
    ssl: false,
  },
  schema,
  casing: "snake_case",
});

export { db };
