import React, { useRef, createContext } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { useAppSelector } from '../../context/hooks';

import { NormalizeGlobalStyle, GlobalStyle } from '../util/global';
import { lightMode, darkMode } from '../util/theme/theme';

import Loader from '../Loader';
import Header from '../Header';
import FilterMenu from '../Library/FilterMenu';
import NowPlaying from '../Player';
import { ScrollContainer, ScrollContent } from '../util/container';

export const ScrollerRefContext: any = createContext({ ref: null });

const MainContainer = styled.main`
    flex: auto;
    flex-grow: 1;
    overflow: auto;
    position: relative;
`;

function Layout({ children }) {

  const isDarkMode = useAppSelector((state) => state.settings.isDarkMode);
  //const isLoading = useAppSelector((state) => state.application.isLoading);
  const appState = useAppSelector((state) => state.application.applicationState);

  const scrollerRef = useRef();

  return (
  <>
      <ThemeProvider theme={(isDarkMode) ? darkMode : lightMode}>
        <NormalizeGlobalStyle />
        <GlobalStyle />

        <Loader isLoading={appState === 'loading'} />
        <Header />
        <FilterMenu />
        <MainContainer>
          <ScrollContainer ref={scrollerRef}>
              <ScrollContent>
                <ScrollerRefContext.Provider value={{ ref: scrollerRef }}>
                  {children}
                </ScrollerRefContext.Provider>
              </ScrollContent>
          </ScrollContainer>
        </MainContainer>
        <NowPlaying />
      </ThemeProvider>
  </>
  );
}

export default Layout
