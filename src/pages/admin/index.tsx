import Head from 'next/head';
import Image from 'next/image';
import Layout from '~/layout/Layout';
import { signIn, useSession } from 'next-auth/react';

const Admin = () => {
  const session = useSession();

  if (session.status === 'loading') {
    return <div className="h-full loading">Loading...</div>;
  }

  if (session.status === 'unauthenticated') {
    void signIn();
  }

  if (session.status === 'authenticated') {
    if (session.data.user?.role !== 'admin') {
      return <div>Unauthorized</div>;
    }
  }

  return (
    <>
      <Head>
        <title>Loft 35 - Admin</title>
        <meta name="description" content="Loft-35 Store" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <div className="flex flex-wrap w-full h-full justify-evenly items-center">
          <div className="card bg-primary shadow-md overflow-hidden">
            <Image
              src={'/Loft35-sign1.png'}
              alt="loft35-sign"
              width={324 / 2}
              height={575 / 2}
            />
          </div>
          <div className="card bg-secondary glass shadow-md overflow-hidden">
            <Image
              src={'/home-promo_1.png'}
              alt="home-promo_1"
              width={324 / 2}
              height={575 / 2}
            />
          </div>
          <div className="card bg-secondary glass shadow-md overflow-hidden">
            <Image
              src={'/home-promo_2.png'}
              alt="home-promo_2"
              width={465 / 2}
              height={421 / 2}
            />
          </div>
          <div className="flex flex-row rounded-2xl bg-primary shadow-md overflow-hidden">
            <h2 className="w-[100px] text-3xl text-accent font-bold place-self-center">
              Las Malas Vibras no van con mi Outfit
            </h2>
            <Image
              className=""
              src={'/home-promo_1.png'}
              alt="home-promo_1"
              width={324 / 2}
              height={575 / 2}
            />
          </div>
          <div className="flex flex-row rounded-2xl bg-primary shadow-md overflow-hidden">
            <h2 className="w-[100px] text-xl text-accent font-bold place-self-center">
              Las Malas Vibras no van con mi Outfit
            </h2>
            <Image
              className=""
              src={'/home-promo_2.png'}
              alt="home-promo_2"
              width={324 / 2}
              height={575 / 2}
            />
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Admin;
