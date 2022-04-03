import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { useAppSelector } from '../../context/hooks';

import { NormalizeGlobalStyle, GlobalStyle } from '../util/global';
import { lightMode, darkMode } from '../util/colors';

import Loader from '../Loader';
import Header from '../Header';
import FilterMenu from '../Library/FilterMenu';
import NowPlaying from '../Player';
import { ScrollContainer, ScrollContent } from '../util/container';

const MainContainer = styled.main`
    flex: auto;
    flex-grow: 1;
    overflow: auto;
`;

function Layout({ children }) {

  const isDarkMode = useAppSelector((state) => state.settings.isDarkMode);

  return (
  <>
      <ThemeProvider theme={(isDarkMode) ? darkMode : lightMode}>
        <NormalizeGlobalStyle />
        <GlobalStyle />

        {/* <Loader /> */}
        <Header />
        <FilterMenu />
        <MainContainer>
          <ScrollContainer>
              <ScrollContent>
                {children}
              </ScrollContent>
          </ScrollContainer>
        </MainContainer>
        <NowPlaying />
      </ThemeProvider>
  </>
  );
}

export default Layout
