import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { BrowserRouter as Router, Routes, Route  } from 'react-router-dom';

import { logout, getToken, checkToken, checkAuthId } from "../context/actions/appStateActions";
import { getServers } from "../context/actions/settingsActions";

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
    const baseUrl = useSelector(state => state.application.baseUrl);
    const librarySection = useSelector(state => state.settings.librarySection);

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

    return (
        <>
            <Loader />
            <Router>
                <Header containerRef={containerRef} userInfo={user} doUserLogin={doUserLogin} doUserLogout={() => dispatch(logout())} />
                <MainContainer ref={containerRef}>
                    <ScrollContainer>
                        <Routes>
                            <Route path="/" element={<Home baseUrl={baseUrl} userInfo={user} section={librarySection} />} />
                            <Route exact path="/library" element={<Library baseUrl={baseUrl} userInfo={user} section={librarySection} />} />
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
