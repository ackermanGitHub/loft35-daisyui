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
    .input(
      z.object({ email: z.string(), address: z.string(), name: z.string() })
    )
    .mutation(async ({ ctx, input }) => {
      const costumer = await ctx.prisma.customer.findUnique({
        where: {
          email: input.email,
        },
      });
      if (!costumer) {
        const newCostumer = await ctx.prisma.customer.create({
          data: {
            email: input.email,
            address: input.address,
            name: input.name,
          },
        });
        console.log(newCostumer);
      }

      // return ctx.prisma.order.create({
      //   data: {
      //     customerId: input.customer,
      //     totalPrice: 0,
      //   },
      // });
    }),
});
