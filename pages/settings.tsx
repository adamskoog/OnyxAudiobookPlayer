import type { InferGetStaticPropsType, GetStaticProps } from 'next'

import Head from 'next/head'

import SettingsPage from '@/components/Settings'

import pjson from '@/package.json'

export const getStaticProps: GetStaticProps<{ version: string }> = async () => {
    // TODO: not sure we want this - we also have a version within PlexJavascriptApi
    // which needs to be updated if using the one from package.json. The whole point
    // is to not have to update it in multiple places....
    return { props: { version: pjson.version }}
}

export default function Page({ version }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <Head>
        <title>Onyx for Plex</title>
        <meta name="description" content="Onyx Audiobook Player for Plex" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SettingsPage appVersion={version} />
    </>
  )
}