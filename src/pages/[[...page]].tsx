import React from 'react';
import { useRouter } from 'next/router';
import { BuilderComponent, useIsPreviewing } from '@builder.io/react';
import DefaultErrorPage from 'next/error';
import Head from 'next/head';
import Layout from '~/layout/Layout';
import { api } from '~/utils/api';

export default function Page() {

  const router = useRouter();
  const { data: page } = api.page.get.useQuery({ urlPath: router.asPath })
  const isPreviewing = useIsPreviewing();

  if (router.isFallback || !page) {
    return <h1>Loading...</h1>
  }

  if (!page && !isPreviewing) {
    return <DefaultErrorPage statusCode={404} />
  }

  return (
    <>
      <Head>
        <title>{page?.data.title}</title>
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