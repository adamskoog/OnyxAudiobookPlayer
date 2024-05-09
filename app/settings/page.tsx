import { Metadata } from 'next'

import SettingsPage from '@/components/Settings'
 
import pjson from '@/package.json'

export const metadata: Metadata = {
    title: pjson.appTitle,
}

export default async function Page() {
  return <SettingsPage appVersion={pjson.version} />
}