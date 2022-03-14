import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { BrowserRouter as Router, Routes, Route  } from 'react-router-dom';

import { logout, getToken, checkToken, checkAuthId } from "../context/actions/appStateActions";
import { getServers } from "../context/actions/settingsActions";
import { NormalizeGlobalStyle, GlobalStyle } from './util/global';
import { prepareLoginRequest } from "../plex/Authentication";

import Header from './Header';
import NowPlaying from './Player';
import Settings from './Settings';
import Home from './Home';
import Loader from './Loader';
import Library from './Library';
import Album from './Album';
import Artist from './Artist';


const MainContainer = styled.main`
    height: calc(100vh - 64px);

    overflow: hidden;

    &.playing {
        height: calc(100vh - 64px - 100px);
    }
    &.menu-open {
        height: calc(100vh - 168px);
    }
    &.playing.menu-open {
        height: calc(100vh - 168px - 100px);
    }
`;

const ScrollContainer = styled.div`
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden; /* Hack fix for expand button negative padding issue. */
`;

const Main = () => {
    const dispatch = useDispatch();

    const user = useSelector(state => state.application.user);
    const authToken = useSelector(state => state.application.authToken);
    const authId = useSelector(state => state.application.authId);
    const darkMode = useSelector(state => state.settings.isDarkMode);

    const containerRef = useRef(null);

    const doUserLogin = async () => {
        const response = await prepareLoginRequest();
        window.location.href = response.url;
    };

    useEffect(() => {    
        if (!user) {
             // We have no user logged in, check for tokens.
             dispatch(getToken());
        } else
            dispatch(getServers());
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
    if (window._env_)
        appBaseUrl = window._env_.BASEURL || '';

    return (
        <>
            <NormalizeGlobalStyle />
            <GlobalStyle darkMode={darkMode} />
            <Loader />
            <Router basename={appBaseUrl}>
                <Header containerRef={containerRef} userInfo={user} doUserLogin={doUserLogin} doUserLogout={() => dispatch(logout())} />
                <MainContainer ref={containerRef}>
                    <ScrollContainer>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route exact path="/library" element={<Library />} />
                            <Route exact path="/album/:ratingKey" element={<Album />}/>
                            <Route exact path="/artist/:ratingKey" element={<Artist />}/>
                            <Route exact path="/settings" element={<Settings />} />
                        </Routes>
                    </ScrollContainer>
                </MainContainer>
                <NowPlaying containerRef={containerRef} />               
            </Router>
        </>
    ); 
}

export default Main;
