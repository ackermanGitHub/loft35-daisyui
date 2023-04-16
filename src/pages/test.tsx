import Head from 'next/head';
import Image from 'next/image';
import Layout from '~/layout/Layout';

const Tests = () => {
  return (
    <>
      <Head>
        <title>Loft 35 - Tests</title>
        <meta name="description" content="Loft-35 Store" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <div className="flex w-full h-full justify-evenly items-center">
          <div className="card shadow-md overflow-hidden">
            <Image
              src={'/Loft35-sign1.png'}
              alt="loft35-sign"
              width={324 / 2}
              height={575 / 2}
            />
          </div>
          <div className="card glass shadow-md overflow-hidden">
            <Image
              src={'/home-promo_1.png'}
              alt="home-promo_1"
              width={324 / 2}
              height={575 / 2}
            />
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Tests;
