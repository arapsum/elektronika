import { z } from "zod";

const clientSchema = z.object({
  PUBLIC_BASE_URL: z.url(),
});

function parseEnv() {
  const clientResult = clientSchema.safeParse(import.meta.env);

  const errors: string[] = [];

  if (!clientResult.success) {
    clientResult.error.issues.forEach((issue) => {
      errors.push(`[client] ${issue.path.join(".")}: ${issue.message}`);
    });
  }

  if (errors.length > 0) {
    throw new Error(
      `\nMissing or Invalid environmental variables:\n${errors.map((e) => ` - ${e}`).join("\nn")}`,
    );
  }

  return {
    ...clientResult.data!,
  };
}

export const env = parseEnv();
