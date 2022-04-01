import React from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';

import Home from '../components/Home';

const HomePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Onyx Player | Home</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Home />
      </>
  )
}

export default HomePage
