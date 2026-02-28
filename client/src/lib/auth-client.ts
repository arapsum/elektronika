import { createAuthClient } from "better-auth/react";
import { env } from "@/env.ts";

export const baseAuthClient = createAuthClient({
  baseURL: `${env.PUBLIC_BASE_URL}/api/auth`,
});
