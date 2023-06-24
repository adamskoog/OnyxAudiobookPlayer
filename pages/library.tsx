import Head from 'next/head'

import LibraryPage from '@/components/Library'

export default function Library() {
  return (
    <>
      <Head>
        <title>Onyx for Plex</title>
        <meta name="description" content="Onyx Audiobook Player for Plex" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <LibraryPage />
    </>
  )
}
