import { Metadata } from 'next'

import LargePlayer from '@/components/LargePlayer'
 
import pjson from '@/package.json'

export const metadata: Metadata = {
    title: pjson.appTitle,
}

export default async function Page() {
  return <LargePlayer />
}