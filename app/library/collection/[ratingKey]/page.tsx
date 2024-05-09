import { Metadata } from 'next'

import CollectionPage from '@/components/Collection';
 
import pjson from '@/package.json'

export const metadata: Metadata = {
    title: pjson.appTitle,
}

export default async function Page({ params }: { params: { ratingKey: string } }) {
  return <CollectionPage ratingKey={params.ratingKey} />
}