import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { BrowserRouter as Router, Switch, Route  } from 'react-router-dom';

import { logout, getToken, checkToken, checkAuthId } from "../context/actions/appStateActions";
import { loadSettingsValues, getServers } from "../context/actions/settingsActions";

import Header from './Header';
import NowPlaying from './player/NowPlaying';
import Settings from './settings/Settings';
import Home from './home/Home';
import Loader from './Loader';
import Library from './library/Library';
import Album from './album/Album';

import PlexAuthentication from "../plex/Authentication";

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

// TODO: handle responsive grid and padding - px-3 sm:px-6 lg:px-8
const ScrollContent = styled.div`
    max-width: 80rem;
    margin-left: auto;
    margin-right: auto;
    padding-left: .75rem;
    padding-right: .75rem;
    padding-top: 1.5rem;
    padding-bottom: 1.5rem;
`;

const Main = () => {
    const dispatch = useDispatch();

    const user = useSelector(state => state.application.user);
    const authToken = useSelector(state => state.application.authToken);
    const authId = useSelector(state => state.application.authId);
    const baseUrl = useSelector(state => state.application.baseUrl);
    const librarySection = useSelector(state => state.settings.librarySection);

    const containerRef = useRef(null);

    const doUserLogin = () => {
        PlexAuthentication.prepareLoginRequest()
            .then((response) => {
                window.location.href = response.url;
            });
    };

    useEffect(() => {
        dispatch(getServers());
    }, [authToken, dispatch]);

    useEffect(() => {    
        if (!user) {
             // We have no user logged in, check for tokens.
             dispatch(getToken());
        } else
            dispatch(loadSettingsValues());
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
                        <ScrollContent>
                            <Switch>
                                <Route exact path="/" component={() => <Home baseUrl={baseUrl} userInfo={user} section={librarySection} /> } />
                                <Route exact path="/library" component={() => <Library baseUrl={baseUrl} userInfo={user} section={librarySection} />} />
                                <Route exact path="/album/:ratingKey" component={(comprops) => 
                                    <Album key={comprops.match.params.ratingKey} ratingKey={comprops.match.params.ratingKey} />
                                }/>
                                <Route exact path="/settings" component={() => <Settings /> } />
                            </Switch>
                        </ScrollContent>
                    </ScrollContainer>
                </MainContainer>
                <NowPlaying containerRef={containerRef} />               
            </Router>
        </>
    ); 
}

export default Main;
