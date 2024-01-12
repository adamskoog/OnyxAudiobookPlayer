import Head from 'next/head'
import { useRouter } from 'next/router';
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next'

import CollectionPage from '@/components/Collection';

import pjson from '@/package.json'

export const getServerSideProps: GetServerSideProps<{ title: string, version: string }> = async () => {
  return { props: { title: pjson.appTitle, version: pjson.version }}
}

export default function Collection({ title }: InferGetServerSidePropsType<typeof getServerSideProps>) {

  const router = useRouter();
  const { query: { ratingKey }} = router;

  const key = ratingKey as string;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={title} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <CollectionPage ratingKey={key} />
    </>
  )
}
