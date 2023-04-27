import Head from 'next/head';
import Layout from '~/layout/Layout';
import { Pool, type QueryResult } from 'pg';
import { type InferGetServerSidePropsType } from "next";
import superjson from 'superjson';

import { getProviders, signIn } from "next-auth/react"
import { useEffect } from 'react';

export const getServerSideProps = async () => {

  const providers = await getProviders();

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  })
  const result = await pool.query('SELECT * FROM "Product"')
  console.log(result)
  await pool.end()

  const jsonString = superjson.stringify(result);

  return {
    props: {
      products: jsonString,
      providers: providers ?? []
    },
  };
}

const Tests: React.FC<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ products, providers }) => {
  let object: QueryResult;
  if (typeof products !== 'undefined') {
    object = superjson.parse(products);
    console.log(object.fields)
    console.log(object)
  }
  useEffect(() => {
    const buyModal = document.getElementById("open-buy-modal");
    const cartModal = document.getElementById("open-cart-modal");
    buyModal?.click()
    cartModal?.click()
  }, [])
  return (
    <>
      <Head>
        <title>Loft 35 - Tests</title>
        <meta name="description" content="Loft-35 Store" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <div className="flex flex-wrap items-center justify-around">
          {providers && Object.values(providers).map((provider) => (
            <div key={provider.name}>
              <button onClick={() => void signIn(provider.id, {
                callbackUrl: "/test"
              })}>
                Sign in with {provider.name}
              </button>
            </div>
          ))}
        </div>
      </Layout>
    </>
  );
};

export default Tests;
