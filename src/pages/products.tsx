import Head from 'next/head';
import Layout from '~/layout/Layout';
import ProductsCardScroll from '~/components/ProductsCardScroll';

const Products = () => {
  return (
    <>
      <Head>
        <title>Loft 35 - Products</title>
        <meta name="description" content="Loft-35 Store" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <ProductsCardScroll />
      </Layout>
    </>
  );
};

export default Products;
