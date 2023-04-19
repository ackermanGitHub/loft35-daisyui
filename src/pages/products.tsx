import { useEffect, useState } from 'react';
import { type GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Layout from '~/layout/Layout';
import ProductsTable from '~/components/ProductsTable';
import ProductsCardScroll from '~/components/ProductsCardScroll';
import { getCookie, setCookie } from 'cookies-next';
import { useCookies } from 'react-cookie';

export const getServerSideProps = ({ req, res }: GetServerSidePropsContext) => {
  const productsView = getCookie('products-view', { req, res });
  if (!productsView) {
    return {
      props: {
        productsView: 'cards',
      },
    };
  }
  return {
    props: {
      productsView,
    },
  };
};

const Products = ({ productsView }: { productsView: string }) => {
  const [productView, setProductView] = useState(productsView);
  const [cookies] = useCookies(['products-view']);

  useEffect(() => {
    const productViewCookie = getCookie('products-view');
    if (!productViewCookie) {
      setCookie('products-view', 'cards');
    } else {
      if (typeof productViewCookie === 'string')
        setProductView(productViewCookie);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const productViewCookie: string = cookies['products-view'];
    setProductView(productViewCookie);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cookies['products-view']]);

  return (
    <>
      <Head>
        <title>Loft 35 - Products</title>
        <meta name="description" content="Loft-35 Store" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        {productView === 'table' && <ProductsTable />}
        {productView === 'cards' && <ProductsCardScroll />}
      </Layout>
    </>
  );
};

export default Products;
