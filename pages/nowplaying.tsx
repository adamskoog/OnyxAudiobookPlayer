import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

import { useAppSelector } from '@/store'

export default function NowPlaying() {

  const mode = useAppSelector(state => state.player.mode)
  const router = useRouter();

  useEffect(() => {
    // Force going home if playing stops.
    if (mode === 'stopped') router.push('/');
  }, [mode]);

  return (
    <>
      <Head>
        <title>Onyx for Plex</title>
        <meta name="description" content="Onyx Audiobook Player for Plex" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* 
        TODO: should we stick to the redirect - or do something smarter here? Up next? 
        Perhaps a redirect to now playing when starting a book?
      */}
      {mode === 'stopped' && 
        <div>Nothing is being played. Please select a book from the library.</div>
      }
    </>
  )
}
