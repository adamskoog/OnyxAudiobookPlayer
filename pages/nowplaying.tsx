import Head from 'next/head'

import { useAppSelector } from '@/store'

export default function NowPlaying() {

  const mode = useAppSelector(state => state.player.mode)

  return (
    <>
      <Head>
        <title>Onyx for Plex</title>
        <meta name="description" content="Onyx Audiobook Player for Plex" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {mode === 'stopped' && 
        <div>Nothing is being played. Please select a book from the library.</div>
      }
    </>
  )
}
