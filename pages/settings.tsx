import type { InferGetStaticPropsType, GetStaticProps } from 'next'

import Head from 'next/head'

import SettingsPage from '@/components/Settings'

import pjson from '@/package.json'

export const getStaticProps: GetStaticProps<{ title: string, version: string }> = async () => {
    return { props: { title: pjson.appTitle, version: pjson.version }}
}

export default function Page({ title, version }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={title} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SettingsPage appVersion={version} />
    </>
  )
}