import "dotenv/config";
import { z } from "zod";

const serverSchema = z.object({
  DATABASE_URL: z.url(),
});

function parseEnv() {
  const serverResult = serverSchema.safeParse(process.env);

  const errors: string[] = [];

  if (!serverResult.success) {
    serverResult.error.issues.forEach((issue) => {
      errors.push(`[client] ${issue.path.join(".")}: ${issue.message}`);
    });
  }

  if (errors.length > 0) {
    throw new Error(
      `\nMissing or Invalid environmental variables:\n${errors.map((e) => ` - ${e}`).join("\nn")}`,
    );
  }

  console.table(serverResult.data);

  return {
    ...serverResult.data!,
  };
}

export const env = parseEnv();
