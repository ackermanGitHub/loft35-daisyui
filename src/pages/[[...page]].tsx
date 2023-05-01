import React from 'react';
import { useRouter } from 'next/router';
import { BuilderComponent, builder, useIsPreviewing } from '@builder.io/react';
import DefaultErrorPage from 'next/error';
import Head from 'next/head';
import Layout from '~/layout/Layout';

// Replace with your Public API Key
builder.init("2b2c25c6e4fc4a03ae76ae797b17151e");

// TODO: fix the ignored/disabled typescript-eslint errors

// Define a function that fetches the Builder
// content for a given page
// Fetch the builder content for the given page

export async function getServerSideProps({ params }: any) {
  const page = await builder
    .get('page', {
      userAttributes: {
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        urlPath: '/' + (params?.page?.join('/') || ''),
      },
    })
    .toPromise();

  // Return the page content as props
  return {
    props: {
      page: page || null,
    },
  };
}

// Define a function that generates the 
// static paths for all pages in Builder
// export async function getStaticPaths() {
//   // Get a list of all pages in Builder
//   const pages = await builder.getAll('page', {
//     // We only need the URL field
//     fields: 'data.url',
//     options: { noTargeting: true },
//   });
// 
//   // Generate the static paths for all pages in Builder
//   return {
//     paths: pages.map(page => `${page.data?.url}`),
//     fallback: true,
//   };
// }

// Define the Page component
export default function Page({ page }: any) {

  const router = useRouter();
  const isPreviewing = useIsPreviewing();

  // If the page is still being generated, 
  // show a loading message
  if (router.isFallback) {
    return <h1>Loading...</h1>
  }

  // If the page content is not available 
  // and not in preview mode, show a 404 error page
  if (!page && !isPreviewing) {
    return <DefaultErrorPage statusCode={404} />
  }

  if (!page) {
    return <DefaultErrorPage statusCode={404} />
  }

  // If the page content is available, render 
  // the BuilderComponent with the page content
  return (
    <>
      <Head>
        <title>{page?.data.title}</title>
      </Head>
      {/* Render the Builder page */}
      <Layout>
        <div style={
          {
            width: "-webkit-fill-available"
          }
        }>
          <BuilderComponent model="page" content={page} />
        </div>
      </Layout>
    </>
  );
}


/* 
import { useRouter } from 'next/router';
import { BuilderComponent, builder, useIsPreviewing, type BuilderPage } from '@builder.io/react';
// import { type GetStaticPropsContext } from 'next';
import DefaultErrorPage from 'next/error';
import Head from 'next/head';

// Replace with your Public API Key
builder.init('2b2c25c6e4fc4a03ae76ae797b17151e');

interface PageProps {
  page: BuilderPage | null;
}

// Define a function that fetches the Builder
// content for a given page
export async function getStaticProps({ params }: { params: { pages: string[] } }): Promise<{ props: PageProps; revalidate: number }> {
  // Fetch the builder content for the given page

  const page = await builder
    .get('page', {
      userAttributes: {
        urlPath: '/' + (params?.pages?.join('/') || ''),
      },
    })
    .toPromise();

  // Return the page content as props
  return {
    props: {
      page: page || null,
    },
    // Revalidate the content every 5 seconds
    revalidate: 5,
  };
}

// Define a function that generates the
// static paths for all pages in Builder
export async function getStaticPaths() {

  // Get a list of all pages in Builder
  const pages = await builder.getAll('page', {
    // We only need the URL field
    fields: 'data.url',
    options: { noTargeting: true },
  });
  console.log(pages);

  // Generate the static paths for all pages in Builder
  return {
    paths: pages.map((page) => `${page.data?.url}`),
    fallback: true,
  };
}

// Define the Page component
const Page = ({ page }: PageProps) => {
  const router = useRouter();
  const isPreviewing = useIsPreviewing();

  // If the page is still being generated,
  // show a loading message
  if (router.isFallback) {
    return <h1>Loading...</h1>;
  }

  // If the page content is not available
  // and not in preview mode, show a 404 error page
  console.log({ page, isPreviewing });

  if ((!page && !isPreviewing) || page === null) {
    return <DefaultErrorPage statusCode={404} />;
  }

  // If the page content is available, render
  // the BuilderComponent with the page content
  return (
    <>
      <Head>
        <title>{page?.data.title}</title>
      </Head>
<BuilderComponent model='page' content={page} />
    </>
  );
}
export default Page;

*/