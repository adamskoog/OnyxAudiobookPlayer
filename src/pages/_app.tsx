import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

import { useAppSelector, useAppDispatch } from '../context/hooks';

import type { AppProps } from 'next/app';

import Layout from '../components/Layout';

import { Provider } from 'react-redux';
import store from '../context/reducers';

import { PlexTvApi } from '../plex/Api';
import { getToken, checkToken, checkAuthId } from '../context/actions/appStateActions';
import { getServers } from '../context/actions/settingsActions';

// Note: this is a temporary fix to avoid the login
// code only running on index. The hope here is that a user can
// load any end point and the checks will be made.
// Doing check for servers to avoid calling everytime, we
// need to make sure servers array is cleared when user changes (edge case, TODO).
function Authentication() {
    const dispatch = useAppDispatch();
    const router = useRouter();

    const user = useAppSelector((state) => state.application.user);
    const authToken = useAppSelector((state) => state.application.authToken);
    const authId = useAppSelector((state) => state.application.authId);
    const servers = useAppSelector((state) => state.settings.servers);
    const applicationState = useAppSelector((state) => state.application.applicationState);

    useEffect(() => {
      PlexTvApi.initialize();
      if (!user) {
        // We have no user logged in, check for tokens.
        dispatch(getToken());
      } else if (!servers) {
        dispatch(getServers());
      }
    }, [user, dispatch]);
  
    // useEffect(() => {
    //   // TODO: this doesn't seem to work....
    //   if (applicationState === 'loggedout') {
    //     router.push({
    //       pathname: '/login',
    //       query: { returnUrl: router.asPath }
    //     });
    //   }
    // }, [applicationState]);

    useEffect(() => {
      PlexTvApi.initialize();
      if (authToken) {
        // We have a token stored, attempt to authenticate.
        dispatch(checkToken(authToken));
      } else if (authId) {
        // We have been redirected and now have an authorization id to handle.
        dispatch(checkAuthId(authId));
      }
    }, [authToken, authId, dispatch]);

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
