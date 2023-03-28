import Head from 'next/head';
import OrdersTable from '~/components/OrdersTable';
import Layout from '~/layout/Layout';
const Orders = () => {
  return (
    <>
      <Head>
        <title>Loft 35 - Perfil</title>
        <meta name="description" content="Loft-35 Store" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <OrdersTable />
      </Layout>
    </>
  );
};

export default Orders;
