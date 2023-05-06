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
      z.object({
        email: z.string(),
        address: z.string(),
        city: z.string(),
        state: z.string(),
        phone: z.string(),
        zipCode: z.string(),
        name: z.string(),
        productsId: z.array(z.number()),
        totalPrice: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      let costumer = await ctx.prisma.customer.findUnique({
        where: {
          email: input.email,
        },
      });
      if (!costumer) {
        costumer = await ctx.prisma.customer.create({
          data: {
            email: input.email,
            address: input.address,
            phone: input.phone,
            name: input.name,
          },
        });
      }
      const order = await ctx.prisma.order.create({
        data: {
          customerId: costumer.id,
          totalPrice: input.totalPrice,
          products: {
            connect: input.productsId.map((id) => ({ id })),
          },
        },
      });
      const shipping = await ctx.prisma.shipping.create({
        data: {
          address: input.address,
          city: input.city,
          state: input.state,
          zipCode: input.zipCode,
          orderId: order.id,
        },
      });

      return await ctx.prisma.order.update({
        where: {
          id: order.id,
        },
        data: {
          shippingInfo: {
            connect: {
              id: shipping.id,
            },
          },
        },
      });
    }),
});
