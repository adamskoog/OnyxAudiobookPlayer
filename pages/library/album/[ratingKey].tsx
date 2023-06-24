import Head from 'next/head'
import { useRouter } from 'next/router';

import AlbumPage from '@/components/Album';

export default function Album() {

  const router = useRouter();
  const { query: { ratingKey }} = router;

  const key = ratingKey as string;

  return (
    <>
      <Head>
        <title>Onyx for Plex</title>
        <meta name="description" content="Onyx Audiobook Player for Plex" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AlbumPage ratingKey={key} />
    </>
  )
}
