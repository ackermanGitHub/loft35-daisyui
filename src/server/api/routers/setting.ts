import { z } from 'zod';
import { redis } from '~/utils/redis';
import { type Setting } from '@prisma/client';
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

  getGlobal: publicProcedure.query(async ({ ctx }) => {
    const cachedSetting: Setting | null = await redis.get('global-setting');

    if (cachedSetting) {
      return cachedSetting;
    }

    const globalSetting = await ctx.prisma.setting.findUnique({
      where: {
        id: 1,
      },
    });

    await redis.set('global-setting', globalSetting);

    return globalSetting;
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
