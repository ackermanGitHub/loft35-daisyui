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
    .input(z.object({ productId: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.product.update({
        where: {
          id: input.productId,
        },
        data: {
          deleted: true,
        },
      });
    }),

  deleteMany: publicProcedure
    .input(z.object({ productIds: z.array(z.number()) }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.product.updateMany({
        where: {
          id: {
            in: input.productIds,
          },
        },
        data: {
          deleted: true,
        },
      });
    }),

  toggleActive: publicProcedure
    .input(z.object({ productId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const currentState = await ctx.prisma.product.findFirst({
        where: {
          id: input.productId,
        },
      });
      return await ctx.prisma.product.update({
        where: {
          id: input.productId,
        },
        data: {
          active: !currentState?.active,
        },
      });
    }),

  setActive: publicProcedure
    .input(z.object({ productId: z.number(), active: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.product.update({
        where: {
          id: input.productId,
        },
        data: {
          active: input.active,
        },
      });
    }),

  get: publicProcedure
    .input(z.object({ productId: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.product.findUnique({
        where: {
          id: input.productId,
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
        console.log(input.secondaryImages);
        const secondaryImagesIds: number[] = [];
        if (input.secondaryImages) {
          for (const [index, element] of input.secondaryImages.entries()) {
            const secondaryImageInput = sharp(element);
            const optimizedSecondaryImage = await secondaryImageInput
              .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
              .jpeg({ quality: 70 })
              .toBuffer();

            // Upload the image to the S3 bucket
            const s3Params = {
              Bucket: bucketName,
              Key: `${Date.now()}-${input.name}-${index}.jpg`,
              Body: optimizedSecondaryImage,
              ContentType: 'image/jpeg',
            };
            const s3ResponseSecondaryImage = await s3
              .upload(s3Params)
              .promise();

            const secondaryImage = await ctx.prisma.image.create({
              data: {
                url: s3ResponseSecondaryImage.Location,
                sizeMb: (optimizedSecondaryImage.length || 0) / 1000,
                color: input.color,
              },
            });
            secondaryImagesIds.push(secondaryImage.id);
          }
        }

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
            secondaryImages: {
              connect: secondaryImagesIds.map((id) => ({ id })),
            },
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
});
