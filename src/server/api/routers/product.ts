import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';
import { S3 } from 'aws-sdk';
import sharp from 'sharp';

const bucketName = 'loft35-aws-bucket';

// AWS S3 configuration
const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export const productRouter = createTRPCRouter({
  delete: publicProcedure
    .input(z.object({ productID: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.product.update({
        where: {
          id: input.productID,
        },
        data: {
          deleted: true,
        },
      });
    }),

  deleteMany: publicProcedure
    .input(z.object({ productIDs: z.array(z.number()) }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.product.updateMany({
        where: {
          id: {
            in: input.productIDs,
          },
        },
        data: {
          deleted: true,
        },
      });
    }),

  toggleActive: publicProcedure
    .input(z.object({ productID: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const currentState = await ctx.prisma.product.findFirst({
        where: {
          id: input.productID,
        },
      });
      return await ctx.prisma.product.update({
        where: {
          id: input.productID,
        },
        data: {
          active: !currentState?.active,
        },
      });
    }),

  setActive: publicProcedure
    .input(z.object({ productID: z.number(), active: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.product.update({
        where: {
          id: input.productID,
        },
        data: {
          active: input.active,
        },
      });
    }),

  get: publicProcedure
    .input(z.object({ productID: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.product.findUnique({
        where: {
          id: input.productID,
        },
      });
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.product.findMany({
      where: {
        deleted: false,
      },
      orderBy: {
        priority: 'asc',
      },
      include: {
        primaryImage: true,
      },
    });
  }),

  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        primaryImage: z.instanceof(Buffer),
        secondaryImages: z.array(z.instanceof(Buffer)).optional(),
        price: z.number(),
        stock: z.number(),
        categoryName: z.string(),
        color: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Use Sharp to resize and optimize the primaryImage
        const primaryImageInput = sharp(input.primaryImage);
        const optimizedPrimaryImage = await primaryImageInput
          .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
          .jpeg({ quality: 70 })
          .toBuffer();

        // Upload the image to the S3 bucket
        const s3Params = {
          Bucket: bucketName,
          Key: `${Date.now()}-${input.name}.jpg`,
          Body: optimizedPrimaryImage,
          ContentType: 'image/jpeg',
        };
        const s3ResponsePrimaryImage = await s3.upload(s3Params).promise();

        // Insert image on db
        const primaryImage = await ctx.prisma.image.create({
          data: {
            url: s3ResponsePrimaryImage.Location,
            sizeMb: (optimizedPrimaryImage.length || 0) / 1000,
            color: input.color,
          },
        });

        // let secondaryImagesIds: number[];
        // input.secondaryImages?.map(async (element, index) => {
        //   const secondaryImageInput = sharp(element);
        //   const optimizedSecondaryImage = await secondaryImageInput
        //     .resize({ width: 800 })
        //     .jpeg({ quality: 80 })
        //     .toBuffer();

        //   // Upload the image to the S3 bucket
        //   const s3Params = {
        //     Bucket: bucketName,
        //     Key: `${Date.now()}-${input.name + '-' + index}.jpg`,
        //     Body: optimizedSecondaryImage,
        //     ContentType: 'image/jpeg',
        //   };
        //   const s3ResponseSecondaryImage = await s3.upload(s3Params).promise();

        //   const secondaryImage = await ctx.prisma.image.create({
        //     data: {
        //       url: s3ResponsePrimaryImage.Location,
        //       sizeMb: (optimizedSecondaryImage.length || 0) / 1000,
        //       color: input.color,
        //     },
        //   });
        //   secondaryImagesIds.push(secondaryImage.id);
        // });

        // checking if the category named exists
        let category = await ctx.prisma.category.findFirst({
          where: {
            name: input.categoryName,
          },
        });

        // if doesnt exist create a new one with that name
        if (!category) {
          const createdCategory = await ctx.prisma.category.create({
            data: {
              name: input.categoryName,
            },
          });
          category = createdCategory;
        }

        const product = await ctx.prisma.product.create({
          data: {
            name: input.name,
            description: input.description,
            imageUrl: s3ResponsePrimaryImage.Location,
            primaryImageId: primaryImage.id,
            deleted: false,
            active: true,
            price: input.price,
            stock: input.stock,
            categoryName: category.name,
            categoryId: category.id,
          },
        });

        return product;
      } catch (error) {
        console.error('Error in create procedure:', error);
        throw error;
      }
    }),

  //got to fix this one
  /* changePriority: publicProcedure
    .input(
      z.object({
        productId: z.number(),
        newPriority: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { productId, newPriority } = input;

        // Buscar el producto en la base de datos
        const product = await ctx.prisma.product.findUnique({
          where: {
            id: productId,
          },
        });

        if (!product) {
          throw new Error(`No se encontró el producto con id ${productId}`);
        }

        // Actualizar la prioridad del producto
        await ctx.prisma.product.update({
          where: {
            id: productId,
          },
          data: {
            priority: newPriority,
          },
        });

        // Actualizar la prioridad de los otros productos en la tabla
        const otherProducts = await ctx.prisma.product.findMany({
          where: {
            id: {
              not: productId,
            },
            priority: newPriority,
          },
        });

        for (const otherProduct of otherProducts) {
          const otherProductId = otherProduct.id;
          const otherProductPriority = otherProduct.priority;

          // Cambiar la prioridad del otro producto
          await ctx.prisma.product.update({
            where: {
              id: otherProductId,
            },
            data: {
              priority: product.priority,
            },
          });

          // Cambiar la prioridad del producto original
          await ctx.prisma.product.update({
            where: {
              id: productId,
            },
            data: {
              priority: otherProductPriority,
            },
          });
        }

        return true;
      } catch (error) {
        console.error('Error in changePriority procedure:', error);
        throw error;
      }
    }), */
});
