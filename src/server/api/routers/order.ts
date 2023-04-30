import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';

export const orderRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ orderId: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.order.findUnique({
        where: {
          id: input.orderId,
        },
      });
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.order.findMany();
  }),

  create: publicProcedure
    .input(z.object({ customer: z.number() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.order.create({
        data: {
          customerId: input.customer,
          totalPrice: 0,
        },
      });
    }),
});
