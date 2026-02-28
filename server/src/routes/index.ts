import { createRouter } from "@/lib/app.ts";
import authRoutes from "./auth.routes.ts";

const appRouter = createRouter();

const routes = [authRoutes];

routes.forEach((route) => {
  appRouter.route(route.path, route.handler);
});

export type RouteType = (typeof routes)[number];

export default appRouter;
