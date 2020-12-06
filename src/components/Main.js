import React, { useState, useEffect } from 'react';
import { connect , useDispatch } from 'react-redux'
import { BrowserRouter as Router, Switch, Route, Redirect  } from 'react-router-dom';

import PlexRequest from '../plex/PlexRequest';

import * as appActions from "../context/actions/appStateActions";
import * as settingsActions from "../context/actions/settingsActions";

import Header from './Header';
import NowPlaying from './NowPlaying';
import Settings from './Settings';
import Library from './Library';
import AlbumInfo from './AlbumInfo';

import { v4 as uuidv4 } from 'uuid';

import PlexAuthentication from "../plex/Authentication";

const mapStateToProps = state => {
    return { 
        isLoading: state.application.isLoading,
        applicationState: state.application.applicationState,
        user: state.application.user, 
        authToken: state.application.authToken,
        authId: state.application.authId,
        baseUrl: state.application.baseUrl,
        settings: state.settings
    };
  };

function ConnectedMain(reduxprops) {

    const dispatch = useDispatch();

    const [playQueue, setPlayQueue] = useState({ id: "", queue: [] });

    const updatePlayQueue = (newPlayQueue) => {
        let newQueue = { id: uuidv4(), queue: newPlayQueue };
        setPlayQueue(newQueue);
    };

    const determineServerUrl = () => {
        PlexRequest.getResources(reduxprops.authToken)
            .then(newResources => {
                // Filter for only media servers.
                const server = newResources.filter((resource) => {
                    return resource.clientIdentifier === reduxprops.settings.serverIdentifier;
                });
                if (!server || server.length === 0) {
                    // TODO: This error state is currently not handled.
                    dispatch(appActions.setApplicationState("error"));
                } else {
                    PlexRequest.serverConnectionTest(server[0].connections, reduxprops.authToken)
                        .then((response) => {
                            dispatch(appActions.setServerInfo(response.uri));
                        }).catch((error) => {
                            dispatch(appActions.setApplicationState("error"));
                        });
                }
            });
    };

    const doUserLogin = () => {
        PlexAuthentication.prepareLoginRequest()
            .then((response) => {
                window.location.href = response.url;
            });
    };

    const doUserLogout = () => {
        dispatch(appActions.logout());
    };

    useEffect(() => {
        if (reduxprops.authToken && reduxprops.settings && reduxprops.settings.serverIdentifier) {
            determineServerUrl();
        }
    }, [reduxprops.authToken, reduxprops.settings, dispatch]);

    useEffect(() => {    
        if (!reduxprops.user) {
             // We have no user logged in, check for tokens.
             dispatch(appActions.getToken());
        } else
            dispatch(settingsActions.loadSettingsValues());
    }, [reduxprops.user, dispatch]);

    useEffect(() => {
        if (reduxprops.authToken) {
            // We have a token stored, attempt to authenticate.
             dispatch(appActions.checkToken(reduxprops.authToken));
        } else if (reduxprops.authId) {
            // We have been redirected and now have an authorization id to handle.
            dispatch(appActions.checkAuthId(reduxprops.authId));
        }
    }, [reduxprops.authToken, reduxprops.authId, dispatch]);

    return (
        <React.Fragment>
            <Router>
                <Header userInfo={reduxprops.user} doUserLogin={doUserLogin} doUserLogout={doUserLogout} />
                <NowPlaying baseUrl={reduxprops.baseUrl} userInfo={reduxprops.user} playQueue={playQueue} updatePlayQueue={updatePlayQueue} />
                <main role="main" className="container">
                    <Switch>
                        <Route exact path="/" component={() => 
                            <React.Fragment>
                                {reduxprops.applicationState === "ready" && (
                                    <Redirect to="/library" />
                                )}
                                {reduxprops.applicationState === "loggedout" && (
                                    <button className="btn btn-dark btn-block" onClick={doUserLogin}>Sign In with Plex</button>
                                )}
                                {reduxprops.applicationState === "error" && (
                                    <div>Error Occurred - TODO: I need to be handled.</div> 
                                )}
                                {(reduxprops.applicationState !== "ready" && reduxprops.applicationState !== "loggedout" && reduxprops.applicationState !== "error") && (
                                    <div></div> 
                                )}
                            </React.Fragment>
                        } />
                        <Route exact path="/library" component={() => <Library baseUrl={reduxprops.baseUrl} userInfo={reduxprops.user} section={reduxprops.settings.librarySection} />} />
                        <Route exact path="/album/:ratingKey" component={(props) => <AlbumInfo baseUrl={reduxprops.baseUrl} userInfo={reduxprops.user} key={props.match.params.ratingKey} ratingKey={props.match.params.ratingKey} playQueue={updatePlayQueue} />} />
                        <Route exact path="/settings" component={(props) => <Settings /> } />
                    </Switch>
                </main>
            </Router>
        </React.Fragment>
    ); 
}

const Main = connect(mapStateToProps)(ConnectedMain);

export default Main;
