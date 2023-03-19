import { Product, Category } from '@prisma/client';
import Head from 'next/head';
import Layout from '~/layout/Layout';
import { prisma } from '~/server/db';

export async function getServerSideProps() {
  const products = await prisma.product.findMany();
  const categories = await prisma.category.findMany();

  return {
    props: { products, categories }, // will be passed to the page component as props
  };
}

const Home = ({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) => {
  console.log(products);
  console.log(categories);

  return (
    <>
      <Head>
        <title>Loft 35</title>
        <meta name="description" content="Loft-35 Store" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout products={products} categories={categories} data-theme="coffee" />
    </>
  );
};

export default Home;
