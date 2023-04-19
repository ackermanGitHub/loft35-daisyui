import Head from 'next/head';
import Image from 'next/image';
import Layout from '~/layout/Layout';

import { prisma } from '~/server/db';
import { getPlaiceholder } from 'plaiceholder';
import { type InferGetStaticPropsType } from 'next/types';

export const getStaticProps = async () => {
  const products = await prisma.product.findMany();

  const productsURLs = products.map((product) => product.imageUrl);

  const images = await Promise.all(
    productsURLs.map(async (src) => {
      const {
        base64,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        img: { width, height, ...img },
      } = await getPlaiceholder(src);

      return {
        ...img,
        alt: 'Paint Splashes',
        title: 'Photo from Unsplash',
        blurDataURL: base64,
      };
    })
  ).then((values) => values);

  return {
    props: {
      images,
    },
  };
};

const Tests: React.FC<InferGetStaticPropsType<typeof getStaticProps>> = ({
  images,
}) => {
  return (
    <>
      <Head>
        <title>Loft 35 - Tests</title>
        <meta name="description" content="Loft-35 Store" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <div className="flex flex-wrap items-center justify-around">
          {images &&
            images.map((image) => (
              <div
                key={image.src}
                className="card card-compact w-[45%] glass mt-12"
              >
                <figure className="relative overflow-hidden pb-[100%] w-full">
                  <Image {...image} placeholder="blur" fill />
                </figure>
                <div className="card-body">
                  <h2 className="card-title">{image.title}</h2>
                  <div className="card-actions justify-end">
                    <button className="btn btn-primary">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height={24}
                        width={24}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </Layout>
    </>
  );
};

export default Tests;
