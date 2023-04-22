import Head from 'next/head';
import Image from 'next/image';
import Layout from '~/layout/Layout';

import { api } from '~/utils/api';

const Tests = () => {
  const { data: productsWithPlaceholder, ...productsFetching } =
    api.product.getAllWithPlaceholders.useQuery();

  console.log(productsFetching);

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
          {
            <div className="card card-compact w-[45%] glass mt-12">
              <div className="card-body">
                <h2 className="card-title">No products</h2>
              </div>
              <div className="card-actions justify-end">
                <button className="btn btn-primary"></button>
              </div>
            </div>
          }
          {productsWithPlaceholder &&
            productsWithPlaceholder.map((product) => (
              <div
                key={product.product.id}
                className="card card-compact w-[45%] glass mt-12"
              >
                <figure className="relative overflow-hidden pb-[100%] w-full">
                  <Image
                    src={product.src}
                    blurDataURL={product.blurDataURL}
                    alt={product.product.name}
                    placeholder="blur"
                    className="object-cover"
                    fill
                    sizes="(max-width: 768px) 60vw,
                      (max-width: 1200px) 40vw,
                      33vw"
                    quality={60}
                  />
                </figure>
                <div className="card-body">
                  <h2 className="card-title">{product.product.name}</h2>
                  <div className="card-actions justify-end">
                    <button className="btn btn-primary">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height={24}
                        width={24}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </Layout>
    </>
  );
};

export default Tests;
