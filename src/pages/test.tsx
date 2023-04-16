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
          <div className="card relative h-1/2 w-1/3 shadow-md overflow-hidden">
            <h2 className="absolute text-lg font-bold w-2/5 top-1/3 left-2">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit.
            </h2>
            <Image
              src={'/home-promo_1.png'}
              alt="home-promo_1"
              width={324 / 2}
              height={575 / 2}
              className="absolute bottom-0 right-0"
            />
          </div>
          <div className="card glass relative h-1/2 w-1/3 shadow-md overflow-hidden">
            <h2 className="absolute text-lg font-bold text-info w-2/5 top-1/3 left-2">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit.
            </h2>
            <Image
              src={'/home-promo_1.png'}
              alt="home-promo_1"
              width={324 / 2}
              height={575 / 2}
              className="absolute bottom-0 right-0"
            />
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Tests;
