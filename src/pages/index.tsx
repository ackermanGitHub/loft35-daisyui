import Head from 'next/head';
import Layout from '~/layout/Layout';
import InstagramCarousel from '~/components/InstagramCarousel';


const Home = () => {

    return (
        <>
            <Head>
                <title>Loft 35 - Home</title>
                <meta name="description" content="Loft-35 Store" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Layout>
                <div className="flex w-full h-full py-12 mb-16 items-center flex-col">
                    <InstagramCarousel />
                </div>
            </Layout>
        </>
    );
};

export default Home;
