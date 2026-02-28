import app from "@/index.ts";
import { serve } from "@hono/node-server";

serve({ fetch: app.fetch, port: 5150 }, (info) => {
  console.log(`Server is listening on http://localhost:${info.port}`);
});
