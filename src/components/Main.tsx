import React, { useEffect, useRef, ReactElement } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../context/hooks';

import {
  logout, getToken, checkToken, checkAuthId,
} from '../context/actions/appStateActions';
import { getServers } from '../context/actions/settingsActions';
import { NormalizeGlobalStyle, GlobalStyle } from './util/global';
import { prepareLoginRequest } from '../plex/Authentication';
import { lightMode, darkMode } from './util/colors';

import Header from './Header';
import { ScrollContainer, ScrollContent } from './util/container';
import FilterMenu from './Library/FilterMenu';
import NowPlaying from './Player';
import Settings from './Settings';
import Home from './Home';
import Loader from './Loader';
import Library from './Library';
import Album from './Album';
import Artist from './Artist';

const MainContainer = styled.main`
    flex: auto;
    flex-grow: 1;
    overflow: auto;
`;

function Main(): ReactElement {
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.application.user);
  const authToken = useAppSelector((state) => state.application.authToken);
  const authId = useAppSelector((state) => state.application.authId);
  const isDarkMode = useAppSelector((state) => state.settings.isDarkMode);

  const containerRef = useRef(null);

  const doUserLogin = async (): Promise<void> => {
    const response = await prepareLoginRequest();
    window.location.href = response.url;
  };

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

  // Determine if we are passing in an environment variable for
  // a different base url (in case of proxy to a sub directory).
  let appBaseUrl = '';
  const localWindow: any = window;
  if (localWindow._env_) appBaseUrl = localWindow._env_.BASEURL || '';

  return (
    <ThemeProvider theme={(isDarkMode) ? darkMode : lightMode}>
      <NormalizeGlobalStyle />
      <GlobalStyle />
      <Loader />
      <Router basename={appBaseUrl}>
        <Header containerRef={containerRef} userInfo={user} doUserLogin={doUserLogin} doUserLogout={() => dispatch(logout())} />
        <FilterMenu />
        <MainContainer ref={containerRef}>
          <ScrollContainer>
            <ScrollContent>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/library" element={<Library />} />
                <Route path="/album/:ratingKey" element={<Album />} />
                <Route path="/artist/:ratingKey" element={<Artist />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </ScrollContent>
          </ScrollContainer>
        </MainContainer>
        <NowPlaying />
      </Router>
    </ThemeProvider>
  );
}

export default Main;
