import React from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';

import Library from '../components/Library';

const LibraryPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Onyx Player | Library</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Library />
    </>
  )
}

export default LibraryPage
