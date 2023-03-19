import { type NextPage } from "next";
import Head from "next/head";
import Header from "~/containers/Header";
import Footer from "~/containers/Footer";
import Main from "~/containers/Main";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Loft 35</title>
        <meta name="description" content="Loft-35 Store" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header data-theme="coffee" />
      <Main data-theme="coffee"></Main>
      <Footer data-theme="coffee" />
    </>
  );
};

export default Home;
