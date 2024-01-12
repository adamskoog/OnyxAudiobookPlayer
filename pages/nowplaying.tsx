import { useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import type { InferGetStaticPropsType, GetStaticProps } from 'next'

import { useAppSelector } from '@/store'

import pjson from '@/package.json'

export const getStaticProps: GetStaticProps<{ title: string, version: string }> = async () => {
  return { props: { title: pjson.appTitle, version: pjson.version }}
}

// TODO: this might be better to do on some kind of 
// middleware in the layout to avoid the actual redirect.
export default function NowPlaying({ title }: InferGetStaticPropsType<typeof getStaticProps>) {

  const albumKey = useRef<null | string>(null);
  const mode = useAppSelector(state => state.player.mode)
  const currentTrack = useAppSelector(state => state.player.currentTrack)

  const router = useRouter();

  useEffect(() => {
    if (currentTrack) albumKey.current = currentTrack.parentRatingKey
  }, [currentTrack]);

  useEffect(() => {
    if (mode === 'stopped' || mode === 'ended') {
      if (albumKey.current) router.push(`/library/album/${albumKey.current}`)
      else router.push('/');
    }
  }, [mode]);

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={title} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {mode === 'stopped' && 
        <div>Nothing is being played. Please select a book from the library.</div>
      }
    </>
  )
}
