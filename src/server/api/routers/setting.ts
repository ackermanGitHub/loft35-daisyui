import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';

export const settingRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ settingId: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.setting.findUnique({
        where: {
          id: input.settingId,
        },
      });
    }),

  toggleDefaultTheme: publicProcedure
    .input(z.object({ settingId: z.number(), newDefaultTheme: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.setting.update({
        where: {
          id: input.settingId,
        },
        data: {
          defaultTheme: input.newDefaultTheme,
        },
      });
    }),

  changeLightTheme: publicProcedure
    .input(z.object({ settingId: z.number(), newLightTheme: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.setting.update({
        where: {
          id: input.settingId,
        },
        data: {
          lightTheme: input.newLightTheme,
        },
      });
    }),

  changeDarkTheme: publicProcedure
    .input(z.object({ settingId: z.number(), newDarkTheme: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.setting.update({
        where: {
          id: input.settingId,
        },
        data: {
          darkTheme: input.newDarkTheme,
        },
      });
    }),
});
