import { Product, Category, Image } from '@prisma/client';
import Head from 'next/head';
import { z } from 'zod';
import Layout from '~/layout/Layout';
import { prisma } from '~/server/db';

export async function getServerSideProps() {
  // const products = await prisma.product.findMany();
  // const categories = await prisma.category.findMany();
  // const images = await prisma.image.findMany();

  let products: Product[] = [];
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
