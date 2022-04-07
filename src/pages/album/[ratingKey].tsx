import React from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import Album from '../../components/Album';

const AlbumPage: NextPage = () => {
    const router = useRouter();
    const { query: { ratingKey }} = router;

    const key = ratingKey as string;
    return (
      <>
        <Head>
          <title>Onyx Player</title>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>
        <Album ratingKey={key} />
      </>
    );
};

export default AlbumPage;
