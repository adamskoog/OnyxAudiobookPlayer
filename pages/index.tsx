import Head from 'next/head'

import HomePage from '@/components/Home'

export default function Home() {
  return (
    <>
      <Head>
        <title>Onyx for Plex</title>
        <meta name="description" content="Onyx Audiobook Player for Plex" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <HomePage />
    </>
  )
}
