import type { NextPage } from "next";
import Head from "next/head";
import Register from "./register";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Bitlink.work</title>
        <meta
          name="description"
          content="Our innovative solutions aim to solve and ease the pain point of business and every end-user."
        />
        <meta name="image" content="/bitlink.jpeg" />
        <meta property="og:title" content="YOUR WEB3 BUSINESS BEGINS WITH US" />
        <meta
          property="og:description"
          content="Our innovative solutions aim to solve and ease the pain point of business and every end-user."
        />
        <meta property="og:image" content="/bitlink.jpeg" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Register />
    </>
  );
};

export default Home;
