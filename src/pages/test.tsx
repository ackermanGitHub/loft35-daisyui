import Head from 'next/head';
import ProductsCardScroll from '~/components/ProductsCardScroll';
import Layout from '~/layout/Layout';
import { api } from '~/utils/api';

const Tests = () => {
  const { data: ProductsData } = api.product.getAll.useQuery();

  return (
    <>
      <Head>
        <title>Loft 35 - Tests</title>
        <meta name="description" content="Loft-35 Store" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <ProductsCardScroll productsData={ProductsData ?? []} />
      </Layout>
    </>
  );
};

export default Tests;
