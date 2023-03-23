import { type Product, type Category, type Image } from '@prisma/client';
import Head from 'next/head';
import Layout from '~/layout/Layout';
// import { z } from 'zod';
// import { prisma } from '~/server/db';

// eslint-disable-next-line @typescript-eslint/require-await
export async function getServerSideProps() {
  // const products = await prisma.product.findMany();
  // const categories = await prisma.category.findMany();
  // const images = await prisma.image.findMany();

  const products: Product[] = [];
  const categories: Category[] = [];
  const images: Image[] = [];

  return {
    props: { products, categories, images }, // will be passed to the page component as props
  };
}

const Home = ({
  products,
  categories,
  images,
}: {
  products: Product[];
  categories: Category[];
  images: Image[];
}) => {
  console.log(products);
  console.log(categories);
  console.log(images);

  return (
    <>
      <Head>
        <title>Loft 35</title>
        <meta name="description" content="Loft-35 Store" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout
        products={products}
        categories={categories}
        images={images}
        data-theme="coffee"
      />
    </>
  );
};

export default Home;
