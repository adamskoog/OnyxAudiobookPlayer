import { Metadata } from 'next'

import ArtistPage from '@/components/Artist';
 
import pjson from '@/package.json'

export const metadata: Metadata = {
    title: pjson.appTitle,
}

export default async function Page({ params }: { params: { ratingKey: string } }) {
  return <ArtistPage ratingKey={params.ratingKey} />
}