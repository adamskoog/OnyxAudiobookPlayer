import '@mantine/core/styles.css';

import '@/styles/mantine.css'
import '@/styles/globals.css'

import React from 'react';
import { MantineProvider } from '@mantine/core';

import StoreProvider from './StoreProvider';
import Layout from '@/components/Layout'

export default function RootLayout({ children }: { children: any }) {

  return (
    <html lang="en">
      <head>
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
        <MantineProvider>
          <StoreProvider>
            <Layout>
                {children}
            </Layout>
          </StoreProvider>
        </MantineProvider>
      </body>
    </html>
  );
}