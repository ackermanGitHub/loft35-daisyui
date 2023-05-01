import React from 'react';
import { useRouter } from 'next/router';
import { BuilderComponent } from '@builder.io/react';
import DefaultErrorPage from 'next/error';
import Head from 'next/head';
import Layout from '~/layout/Layout';
import { api } from '~/utils/api';
import Loader from '~/components/Loader';

export default function Page() {

  const router = useRouter();
  const { data: page, isLoading } = api.page.get.useQuery({ urlPath: router.asPath })

  if (isLoading) {
    return <Loader />
  }

  if (!page) {
    return <DefaultErrorPage statusCode={404} />
  }

  return (
    <>
      <Head>
        <title>Loft35 - {page?.name}</title>
      </Head>
      <Layout>
        <div style={
          {
            width: "-webkit-fill-available",
            overflow: "hidden",
          }
        }>
          <BuilderComponent model="page" content={page} />
        </div>
      </Layout>
    </>
  );
}

/* Page.getInitialProps = (ctx: any) => {

  console.log(ctx);

  return {};
};
 */