import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';
import { builder, type BuilderPage } from '@builder.io/react';

export const pagesRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ urlPath: z.string() }))
    .query(async ({ input }) => {
      const page = await builder
        .get('page', {
          userAttributes: {
            // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
            urlPath: input.urlPath,
          },
        })
        .toPromise();

      if (!page) return null;
      return page as BuilderPage;
    }),
});
