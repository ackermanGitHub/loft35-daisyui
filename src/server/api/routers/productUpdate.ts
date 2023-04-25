import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';

export const productUpdateRouter = createTRPCRouter({
  updateName: publicProcedure
    .input(z.object({ productId: z.number(), newName: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.product.update({
        where: {
          id: input.productId,
        },
        data: {
          name: input.newName,
        },
      });
    }),

  updateDescription: publicProcedure
    .input(z.object({ productId: z.number(), newDescription: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.product.update({
        where: {
          id: input.productId,
        },
        data: {
          description: input.newDescription,
        },
      });
    }),

  updatePrice: publicProcedure
    .input(z.object({ productId: z.number(), newPrice: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.product.update({
        where: {
          id: input.productId,
        },
        data: {
          price: input.newPrice,
        },
      });
    }),

  // TODO fix this, product must update categoryId too
  updateCategory: publicProcedure
    .input(z.object({ productId: z.number(), newCategory: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.product.update({
        where: {
          id: input.productId,
        },
        data: {
          categoryName: input.newCategory,
        },
      });
    }),

  updateStock: publicProcedure
    .input(z.object({ productId: z.number(), newStock: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.product.update({
        where: {
          id: input.productId,
        },
        data: {
          stock: input.newStock,
        },
      });
    }),

  changePriorityUp: publicProcedure
    .input(
      z.object({
        productId: z.number(),
        targetId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { productId, targetId } = input;

      const product = await ctx.prisma.product.findUnique({
        where: {
          id: productId,
        },
      });

      const targetProduct = await ctx.prisma.product.findUnique({
        where: {
          id: targetId,
        },
      });

      if (!product) {
        throw new Error(`No se encontró el producto con id ${productId}`);
      }
      if (!targetProduct) {
        throw new Error(`No se encontró el producto con id ${targetId}`);
      }

      const productsBetween = await ctx.prisma.product.findMany({
        where: {
          AND: [
            { priority: { gte: product.priority + 1 } },
            { priority: { lte: targetProduct.priority } },
          ],
        },
        orderBy: {
          priority: 'asc',
        },
      });

      const firstPriorityProduct = await ctx.prisma.product.findFirst({
        orderBy: {
          priority: 'asc',
        },
      });

      if (!firstPriorityProduct) {
        throw new Error(`No se encontró el primer producto en prioridad`);
      }
      await ctx.prisma.product.update({
        where: {
          id: productId,
        },
        data: {
          priority: firstPriorityProduct.priority - 5,
        },
      });

      if (product.priority < targetProduct.priority) {
        const destinatioProduct = await ctx.prisma.product.findUnique({
          where: {
            priority: targetProduct.priority + 1,
          },
        });

        if (!destinatioProduct) {
          return await ctx.prisma.product.update({
            where: {
              id: product.id,
            },
            data: {
              priority: targetProduct.priority + 1,
            },
          });
        }

        for (const betweenProduct of productsBetween) {
          await ctx.prisma.product.update({
            where: {
              id: betweenProduct.id,
            },
            data: {
              priority: betweenProduct.priority - 1,
            },
          });
        }
        // Cambiar la prioridad del producto original
        return await ctx.prisma.product.update({
          where: {
            id: productId,
          },
          data: {
            priority: targetProduct.priority,
          },
        });
      }
    }),

  changePriorityDown: publicProcedure
    .input(
      z.object({
        productId: z.number(),
        targetId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { productId, targetId } = input;

      const product = await ctx.prisma.product.findUnique({
        where: {
          id: productId,
        },
      });

      const targetProduct = await ctx.prisma.product.findUnique({
        where: {
          id: targetId,
        },
      });

      if (!product) {
        throw new Error(`No se encontró el producto con id ${productId}`);
      }
      if (!targetProduct) {
        throw new Error(`No se encontró el producto con id ${targetId}`);
      }

      const productsBetween = await ctx.prisma.product.findMany({
        where: {
          AND: [
            { priority: { gte: targetProduct.priority } },
            { priority: { lte: product.priority - 1 } },
          ],
        },
        orderBy: {
          priority: 'desc',
        },
      });

      const firstPriorityProduct = await ctx.prisma.product.findFirst({
        orderBy: {
          priority: 'asc',
        },
      });

      if (!firstPriorityProduct) {
        throw new Error(`No se encontró el primer producto en prioridad`);
      }
      await ctx.prisma.product.update({
        where: {
          id: productId,
        },
        data: {
          priority: firstPriorityProduct.priority - 5,
        },
      });

      if (product.priority > targetProduct.priority) {
        const destinatioProduct = await ctx.prisma.product.findUnique({
          where: {
            priority: targetProduct.priority - 1,
          },
        });

        if (!destinatioProduct) {
          return await ctx.prisma.product.update({
            where: {
              id: product.id,
            },
            data: {
              priority: targetProduct.priority - 1,
            },
          });
        }

        for (const betweenProduct of productsBetween) {
          await ctx.prisma.product.update({
            where: {
              id: betweenProduct.id,
            },
            data: {
              priority: betweenProduct.priority + 1,
            },
          });
        }
        // Cambiar la prioridad del producto original
        return await ctx.prisma.product.update({
          where: {
            id: productId,
          },
          data: {
            priority: targetProduct.priority,
          },
        });
      }
    }),
});

/* 
model Product {
  id              Int      @id @default(autoincrement())
  name            String
  description     String?
  primaryImageId  Int      @unique
  imageUrl        String
  price           Float
  priority        Int      @unique @default(autoincrement())
  active          Boolean
  deleted         Boolean
  stock           Int
  categoryName    String
  categoryId      Int
  category        Category @relation(fields: [categoryId], references: [id])
  primaryImage    Image    @relation(fields: [primaryImageId], references: [id])
  orders          Order[]  @relation("Product-Orders")
  secondaryImages Image[]  @relation("secondaryImages")
}
*/
