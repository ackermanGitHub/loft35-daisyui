import Head from 'next/head';
import ProductTable from '~/components/ProductTable';
import Layout from '~/layout/Layout';

const Home = () => {
  return (
    <>
      <Head>
        <title>Loft 35 - Products</title>
        <meta name="description" content="Loft-35 Store" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <ProductTable />
      </Layout>
    </>
  );
};

export default Home;
