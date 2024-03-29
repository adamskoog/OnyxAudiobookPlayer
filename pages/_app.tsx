import '@mantine/core/styles.css';
import '@/styles/globals.css'
import '@/styles/mantine.css'

import type { AppProps } from 'next/app'

import { MantineProvider } from '@mantine/core';

import { store } from '@/store'
import { Provider } from 'react-redux'

import Layout from '@/components/Layout'

export default function App({ Component, pageProps }: AppProps) {
  
  return (
    <MantineProvider> 
    <Provider store={store}>
      <Layout {...pageProps}>
        <Component {...pageProps} />
      </Layout>
    </Provider>
    </MantineProvider>
  )
}
