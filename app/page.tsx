import { Metadata } from 'next'

import HomePage from '@/components/Home'
 
import pjson from '@/package.json'

export const metadata: Metadata = {
    title: pjson.appTitle,
}

export default async function Page() {
  return <HomePage />
}