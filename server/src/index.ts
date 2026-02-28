import createApp from "@/lib/app.js";
import appRouter from "@/routes/index.ts";
import { showRoutes } from "hono/dev";

const app = createApp().basePath("/api");

app.get("/", (c) => {
  return c.json({ message: "Hello Elektronika!" });
});

app.route("/", appRouter);

showRoutes(app);

export default app;
