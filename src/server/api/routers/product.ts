import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { S3 } from "aws-sdk";
import sharp from "sharp";

const bucketName = "loft35-aws-bucket";

// AWS S3 configuration
const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const productSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  file: z.instanceof(Buffer),
  secondaryImages: z.union([z.array(z.string()), z.undefined()]),
  price: z.number(),
  stock: z.number(),
  categoryName: z.string(),
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
    .input(productSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        // Use Sharp to resize and optimize the image
        const image = sharp(input.file);
        const optimizedImage = await image
          .resize({ width: 800 })
          .jpeg({ quality: 80 })
          .toBuffer();

        // Upload the file to the S3 bucket
        const s3Params = {
          Bucket: bucketName,
          Key: `${Date.now()}-${input.name}.jpg`,
          Body: optimizedImage,
          ContentType: "image/jpeg",
        };
        const s3Response = await s3.upload(s3Params).promise();

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

        return await ctx.prisma.product.create({
          data: {
            name: input.name,
            description: input.description,
            image: s3Response.Location,
            secondaryImages: input.secondaryImages,
            price: input.price,
            stock: input.stock,
            categoryId: category.id,
          },
        });
      } catch (error) {
        console.error("Error in create procedure:", error);
        throw error;
      }
    }),
});
