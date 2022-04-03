import React, { useEffect } from 'react';
import type { AppProps } from 'next/app';
import { useAppSelector, useAppDispatch } from '../context/hooks';

import { Provider } from 'react-redux';
import store from '../context/reducers';

import Layout from '../components/Layout';
import { PlexTvApi } from '../plex/Api';
import { checkToken } from '../context/actions/appStateActions';
import { getServers } from '../context/actions/settingsActions';

// Note: this is a temporary fix to avoid the login
// code only running on index. The hope here is that a user can
// load any end point and the checks will be made.
// Doing check for servers to avoid calling everytime, we
// need to make sure servers array is cleared when user changes (edge case, TODO).
function Authentication() {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.application.user);

    useEffect(() => {
        const initialize = async () => {
            await PlexTvApi.initialize();
            if (!PlexTvApi.isLoggedOut) {
                dispatch(checkToken());
            } else {
              // set application state to 'loggedOut'
            }
        }
        initialize();
    }, []);

    useEffect(() => {
        if (user) dispatch(getServers());
    }, [user]);
 
    return (
        <></>
    );
};


function MyApp({ Component, pageProps }: AppProps) {

  return (
  <>
    <React.StrictMode>     
      <Provider store={store}>
        <Layout>
          <Authentication />
          <Component {...pageProps} />
        </Layout>
      </Provider>
    </React.StrictMode>
  </>
  );
}

export default MyApp
