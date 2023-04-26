import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';
import { getPlaiceholder } from 'plaiceholder';

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

  deleteManyHard: publicProcedure
    .input(
      z.object({
        productIds: z.array(z.number()),
        storageRoutes: z.array(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      console.log(input);
      const prismaDelProdRes = await ctx.prisma.product.deleteMany({
        where: {
          id: {
            in: input.productIds,
          },
        },
      });

      const prismaDelImgsRes = await ctx.prisma.image.deleteMany({
        where: {
          productId: {
            in: input.productIds,
            not: null,
          },
        },
      });

      const supabaseRes = await ctx.supabase.storage
        .from('images')
        .remove(input.storageRoutes);
      return { prismaDelProdRes, prismaDelImgsRes, supabaseRes };
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

  createWithOutSupabase: publicProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        primaryImage: z.object({ path: z.string(), sizeMb: z.number() }),
        secondaryImages: z
          .array(z.object({ path: z.string(), sizeMb: z.number() }))
          .optional(),
        price: z.number(),
        stock: z.number(),
        categoryName: z.string(),
        color: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // TODO implement sharp for optimizing the images
        const bucketName = 'images';
        const { base64: primaryImgBase64 } = await getPlaiceholder(
          `https://uhvjljbcyqfpccwrvkqx.supabase.co/storage/v1/object/public/${bucketName}/${input.primaryImage.path}`
        );

        // Insert image on db
        const primaryImage = await ctx.prisma.image.create({
          data: {
            url: `https://uhvjljbcyqfpccwrvkqx.supabase.co/storage/v1/object/public/${bucketName}/${input.primaryImage.path}`,
            blurDataURL: primaryImgBase64,
            // TODO rename to route or path
            name: input.primaryImage.path,
            sizeMb: input.primaryImage.sizeMb,
            color: input.color,
          },
        });

        const secondaryImagesIds: number[] = [];
        if (input.secondaryImages) {
          for (const [_index, element] of input.secondaryImages.entries()) {
            const { base64: secondaryImgBase64 } = await getPlaiceholder(
              `https://uhvjljbcyqfpccwrvkqx.supabase.co/storage/v1/object/public/${bucketName}/${element.path}`
            );

            const secondaryImage = await ctx.prisma.image.create({
              data: {
                url: `https://uhvjljbcyqfpccwrvkqx.supabase.co/storage/v1/object/public/${bucketName}/${element.path}`,
                name: element.path,
                blurDataURL: secondaryImgBase64,
                sizeMb: element.sizeMb,
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
            imageUrl: primaryImage.url,
            imageName: primaryImage.name,
            imageBlurDataURL: primaryImgBase64,
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

/* 
import sharp from 'sharp';

createWithSupabase: publicProcedure
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
        const bucketName = 'images';
        const folderName = 'products';
        // Use Sharp to resize and optimize the primaryImage
        const primaryImageInput = sharp(input.primaryImage);
        const optimizedPrimaryImage = await primaryImageInput
          .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
          .jpeg({ quality: 60 })
          .toBuffer();

        const currentDate = new Date();
        const uniqueName = `${input.name
          .split(' ')
          .join('')}-${currentDate.getFullYear()}${
          currentDate.getMonth() + 1
        }${currentDate.getDate()}${currentDate.getHours()}${currentDate.getMinutes()}${currentDate.getSeconds()}`;

        const { data: primaryImageURL, error: uploadError } =
          await ctx.supabase.storage
            .from(bucketName)
            .upload(`${folderName}/${uniqueName}.jpg`, optimizedPrimaryImage);

        if (uploadError || !primaryImageURL) {
          throw new Error(
            `Error while uploading the primary image: ${uploadError?.message}`
          );
        }

        const { base64: primaryImgBase64 } = await getPlaiceholder(
          `https://uhvjljbcyqfpccwrvkqx.supabase.co/storage/v1/object/public/${bucketName}/${primaryImageURL.path}`
        );

        // Insert image on db
        const primaryImage = await ctx.prisma.image.create({
          data: {
            url: `https://uhvjljbcyqfpccwrvkqx.supabase.co/storage/v1/object/public/${bucketName}/${primaryImageURL.path}`,
            blurDataURL: primaryImgBase64,
            name: `${bucketName}/${primaryImageURL.path}`,
            sizeMb: (optimizedPrimaryImage.length || 0) / 1000,
            color: input.color,
          },
        });

        const secondaryImagesIds: number[] = [];
        if (input.secondaryImages) {
          for (const [index, element] of input.secondaryImages.entries()) {
            const secondaryImageInput = sharp(element);
            const optimizedSecondaryImage = await secondaryImageInput
              .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
              .jpeg({ quality: 50 })
              .toBuffer();

            const { data: secondaryImageURL, error: uploadSecError } =
              await ctx.supabase.storage
                .from(bucketName)
                .upload(
                  `${folderName}/${uniqueName}-${index + 1}.jpg`,
                  optimizedPrimaryImage
                );

            if (uploadSecError || !secondaryImageURL) {
              throw new Error(
                `Error while uploading a secondary image: ${uploadSecError?.message}`
              );
            }

            const { base64: secondaryImgBase64 } = await getPlaiceholder(
              `https://uhvjljbcyqfpccwrvkqx.supabase.co/storage/v1/object/public/${bucketName}/${secondaryImageURL.path}`
            );

            const secondaryImage = await ctx.prisma.image.create({
              data: {
                url: `https://uhvjljbcyqfpccwrvkqx.supabase.co/storage/v1/object/public/${bucketName}/${secondaryImageURL.path}`,
                name: secondaryImageURL.path,
                blurDataURL: secondaryImgBase64,
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
            imageUrl: primaryImage.url,
            imageName: primaryImage.name,
            imageBlurDataURL: primaryImgBase64,
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


import { redis } from '~/utils/redis';
import { type Product, type Image } from '@prisma/client';

getAllWithPlaceholders: publicProcedure.query(async ({ ctx }) => {
    const products = await ctx.prisma.product.findMany({
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

    const productsWithPlaceholder = await Promise.all(
      products.map(async (product) => {
        const {
          base64,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          img: { width, height, ...imgPlaceholder },
        } = await getPlaiceholder(product.imageUrl);

        return {
          ...imgPlaceholder,
          product,
          blurDataURL: base64,
        };
      })
    );

    return productsWithPlaceholder;
  }),

getAllWithPlaceholdersAndRedis: publicProcedure.query(async ({ ctx }) => {
    const cachedProducts:
      | {
          product: Product & {
            primaryImage: Image;
          };
          blurDataURL: string;
          src: string;
          type?: string | undefined;
        }[]
      | null = await redis.get('products');

    if (cachedProducts) {
      return cachedProducts;
    }

    const products = await ctx.prisma.product.findMany({
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

    const productsWithPlaceholder = await Promise.all(
      products.map(async (product) => {
        const {
          base64,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          img: { width, height, ...imgPlaceholder },
        } = await getPlaiceholder(product.imageUrl);

        return {
          ...imgPlaceholder,
          product,
          blurDataURL: base64,
        };
      })
    );

    if (!cachedProducts) {
      await redis.set('products', JSON.stringify(productsWithPlaceholder));
    }

    return productsWithPlaceholder;
  }),

const bucketName = 'loft35-aws-bucket';

// AWS S3 configuration
const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

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
*/
