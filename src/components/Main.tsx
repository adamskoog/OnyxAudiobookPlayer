import React, { useEffect, ReactElement } from 'react';
import { useAppSelector, useAppDispatch } from '../context/hooks';

import {
  logout, getToken, checkToken, checkAuthId,
} from '../context/actions/appStateActions';
import { getServers } from '../context/actions/settingsActions';
// import { NormalizeGlobalStyle, GlobalStyle } from './util/global';
// import { prepareLoginRequest } from '../plex/Authentication';
// import { lightMode, darkMode } from './util/colors';

// import NowPlaying from './Player';
// import Settings from './Settings';
import Home from './Home';
// import Loader from './Loader';
// import Library from './Library';
// import Album from './Album';
// import Artist from './Artist';

function Main(): ReactElement {
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.application.user);
  const authToken = useAppSelector((state) => state.application.authToken);
  const authId = useAppSelector((state) => state.application.authId);

  useEffect(() => {
    if (!user) {
      // We have no user logged in, check for tokens.
      dispatch(getToken());
    } else dispatch(getServers());
  }, [user, dispatch]);

  useEffect(() => {
    if (authToken) {
      // We have a token stored, attempt to authenticate.
      dispatch(checkToken(authToken));
    } else if (authId) {
      // We have been redirected and now have an authorization id to handle.
      dispatch(checkAuthId(authId));
    }
  }, [authToken, authId, dispatch]);

  return (
      <Home />
  );
}

{/* <Routes>
  <Route path="/" element={<Home />} />
  <Route path="/library" element={<Library />} />
  <Route path="/album/:ratingKey" element={<Album />} />
  <Route path="/artist/:ratingKey" element={<Artist />} />
  <Route path="/settings" element={<Settings />} />
</Routes> */}

export default Main;
