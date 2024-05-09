import { Metadata } from 'next'

import LibraryPage from '@/components/Library'
 
import pjson from '@/package.json'

export const metadata: Metadata = {
    title: pjson.appTitle,
}

export default async function Page() {
  return <LibraryPage />
}