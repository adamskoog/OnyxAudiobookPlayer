import React from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import Album from '../../components/Album';

const AlbumPage: NextPage = () => {
    const router = useRouter();
    const { query: { ratingKey }} = router;

  return (
    <>
      <Head>
        <title>Onyx Player</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Album ratingKey={ratingKey} />
    </>
  )
}

export default AlbumPage
