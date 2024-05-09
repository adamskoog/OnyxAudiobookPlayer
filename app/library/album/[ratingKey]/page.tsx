import { Metadata } from 'next'

import AlbumPage from '@/components/Album';
 
import pjson from '@/package.json'

export const metadata: Metadata = {
    title: pjson.appTitle,
}

export default async function Page({ params }: { params: { ratingKey: string } }) {
  return <AlbumPage ratingKey={params.ratingKey} />
}