import Head from 'next/head';
import Layout from '~/layout/Layout';

const Error = () => {
  return (
    <>
      <Head>
        <title>Loft 35 - Error</title>
        <meta name="description" content="Loft-35 Store" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <div>Error Page</div>
      </Layout>
    </>
  );
};

export default Error;
