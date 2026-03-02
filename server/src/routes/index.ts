import { createRouter } from "@/lib/app.ts";
import authRoutes from "./auth.routes.ts";
import categoryRoutes from "./category.routes.ts";
import brandRoutes from "./brand.routes.ts";
import productRoutes from "./product.routes.ts";
import variantRoutes from "./variant.routes.ts";

const appRouter = createRouter();

const routes = [authRoutes, brandRoutes, categoryRoutes, productRoutes, variantRoutes];

routes.forEach((route) => {
  appRouter.route(route.path, route.handler);
});

export type RouteType = (typeof routes)[number];

export default appRouter;
