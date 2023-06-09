import { createTRPCRouter } from '~/server/api/trpc';
import { productRouter } from './routers/product';
import { categoryRouter } from './routers/category';
import { productUpdateRouter } from './routers/productUpdate';
import { settingRouter } from './routers/setting';
import { orderRouter } from './routers/order';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  product: productRouter,
  updateProduct: productUpdateRouter,
  category: categoryRouter,
  setting: settingRouter,
  order: orderRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
