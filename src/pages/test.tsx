import Head from 'next/head';
import Layout from '~/layout/Layout';
//import { type QueryResult } from 'pg';
// import { pool } from '~/utils/pg';
// import { type InferGetServerSidePropsType } from "next";
// import superjson from 'superjson';
// import { useToast } from '~/hooks/useToast';
import InstagramCarousel from '~/components/InstagramCarousel';

/* export const getServerSideProps = async () => {
  const result = await pool.query('SELECT * FROM "Product"')
  console.log(result)
  await pool.end()

  const jsonString = superjson.stringify(result);

  return {
    props: {
      products: jsonString,
    },
  };
} */

//const Tests: React.FC<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ products }) => {

const Tests = () => {

  // eslint-disable-next-line @typescript-eslint/unbound-method
  // const { addToast } = useToast();

  /* let object: QueryResult;
  if (typeof products !== 'undefined') {
    object = superjson.parse(products);
    console.log(object.fields)
    console.log(object)
  } */

  return (
    <>
      <Head>
        <title>Loft 35 - Tests</title>
        <meta name="description" content="Loft-35 Store" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <div className="flex w-full h-full py-12 mb-16 items-center flex-col">
          <InstagramCarousel />
          {/*
          <div>
            <button className='btn btn-error' onClick={() => {
              addToast({
                type: 'error',
                title: 'Error!',
                description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
              });
            }}>Error</button>
            <button className='btn btn-warning' onClick={() => {
              addToast({
                type: 'warning',
                title: 'Warning!',
                description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
              });
            }}>Warning</button>
            <button className='btn btn-success' onClick={() => {
              addToast({
                type: 'success',
                title: 'Success!',
                description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
              });
            }}>Success</button>
            <button className='btn btn-info' onClick={() => {
              addToast({
                type: 'info',
                title: 'Info!',
                description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
              });
            }}>Info</button>
            <button className='btn btn-primary' onClick={() => {
              const buyModal = document.getElementById("buy-modal") as HTMLInputElement;
              const cartModal = document.getElementById("cart-modal") as HTMLInputElement;

              buyModal.checked = true
              cartModal.checked = true
            }}>Modal</button>
          </div>
          */}
        </div>
      </Layout>
    </>
  );
};

export default Tests;
