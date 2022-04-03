import React from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';

import Settings from '../components/Settings';

const SettingsPage: NextPage = () => {
  return (
      <>
      <Head>
        <title>Onyx Player | Settings</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Settings />
    </>
  )
}

export default SettingsPage
