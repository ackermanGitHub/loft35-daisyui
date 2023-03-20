import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';

export const imageRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ imageID: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.image.findUnique({
        where: {
          id: input.imageID,
        },
      });
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.image.findMany();
  }),
});
