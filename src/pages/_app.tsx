import React from 'react';

import type { AppProps } from 'next/app';

import Layout from '../components/Layout';

import { Provider } from 'react-redux';
import store from '../context/reducers';

function MyApp({ Component, pageProps }: AppProps) {

  return (
  <>
    <React.StrictMode>     
      <Provider store={store}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Provider>
    </React.StrictMode>
  </>
  );
}

export default MyApp
