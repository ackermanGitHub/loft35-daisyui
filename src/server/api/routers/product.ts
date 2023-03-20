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

const createProductInput = z.object({
  name: z.string(),
  description: z.string().optional(),
  primaryImage: z.instanceof(Buffer),
  secondaryImages: z.array(z.instanceof(Buffer)).optional(),
  active: z.boolean(),
  deleted: z.boolean(),
  price: z.number(),
  stock: z.number(),
  categoryName: z.string(),
  color: z.string(),
});

export const productRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ productID: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.product.findUnique({
        where: {
          id: input.productID,
        },
      });
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.product.findMany();
  }),

  create: publicProcedure
    .input(createProductInput)
    .mutation(async ({ ctx, input }) => {
      try {
        // Use Sharp to resize and optimize the primaryImage
        const primaryImageInput = sharp(input.primaryImage);
        // const metadata = await image.metadata();
        // console.log(metadata);

        // optimizing primaryImage
        const optimizedPrimaryImage = await primaryImageInput
          .resize({ width: 800 })
          .jpeg({ quality: 80 })
          .toBuffer();

        // Upload the image to the S3 bucket
        const s3Params = {
          Bucket: bucketName,
          Key: `${Date.now()}-${input.name}.jpg`,
          Body: optimizedPrimaryImage,
          ContentType: 'image/jpeg',
        };
        const s3ResponsePrimaryImage = await s3.upload(s3Params).promise();

        // const { ContentLength: primaryImageSize } = await s3
        //   .headObject({ Bucket: bucketName, Key: s3ResponsePrimaryImage.Key })
        //   .promise();

        //if (ContentLength) {
        //  console.log(ContentLength / 1000);
        //}

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

        let category = await ctx.prisma.category.findFirst({
          where: {
            name: input.categoryName,
          },
        });

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
            //image: primaryImage,
            primaryImageId: primaryImage.id,
            // imageSizeMb: 2.6,  np
            // secondaryImages: input.secondaryImages,
            deleted: input.deleted,
            active: input.active,
            price: input.price,
            stock: input.stock,
            categoryName: input.categoryName,
            categoryId: category.id,
          },
        });

        return product;
      } catch (error) {
        console.error('Error in create procedure:', error);
        throw error;
      }
    }),

  changePriority: publicProcedure
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
    }),
});
