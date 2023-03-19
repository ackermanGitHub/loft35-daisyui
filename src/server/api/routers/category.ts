import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const categoryRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ categoryID: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.category.findUnique({
        where: {
          id: input.categoryID,
        },
      });
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.category.findMany();
  }),
});
