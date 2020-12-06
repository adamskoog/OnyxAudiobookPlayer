import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux'
import { BrowserRouter as Router, Switch, Route, Redirect  } from 'react-router-dom';

import PlexRequest from '../plex/PlexRequest';
import SettingsUtils from '../utility/settings';

import * as actionTypes from "../context/actions/actionTypes";
import * as userActions from "../context/actions/actions";
import Header from './Header';
import LoginForm from './LoginForm';
import NowPlaying from './NowPlaying';
import Settings from './Settings';
import Library from './Library';
import AlbumInfo from './AlbumInfo';

import { v4 as uuidv4 } from 'uuid';

function Main() {

    const dispatch = useDispatch()

    const [appStatus, setAppStatus] = useState("loading");
    const [userInfo, setUserInfo] = useState(null);
    const [baseUrl, setBaseUrl] = useState("")
    const [playQueue, setPlayQueue] = useState({ id: "", queue: [] });
    const [settings, setSettings] = useState({serverIdentifier: null, librarySection: null});

    const updatePlayQueue = (newPlayQueue) => {
        let newQueue = { id: uuidv4(), queue: newPlayQueue };
        setPlayQueue(newQueue);
    };

    const updateAuthState = (newUserInfo, newAppState) => {
        setUserInfo(newUserInfo);
        setAppStatus(newAppState);
    };

    const updateSettingsState = (settings) => {
        setSettings({ serverIdentifier: settings.serverIdentifier, librarySection: settings.librarySection });
    };

    const determineServerUrl = () => {
        PlexRequest.getResources(userInfo.authToken)
            .then(newResources => {

                // Filter for only media servers.
                const server = newResources.filter((resource) => {
                    return resource.clientIdentifier === settings.serverIdentifier;
                });

                if (!server || server.length === 0) {
                    // TODO: This error state is currently not handled.
                    setBaseUrl(null);
                    setAppStatus("error");
                } else {
                    PlexRequest.serverConnectionTest(server[0].connections, userInfo.authToken)
                        .then((response) => {
                            setBaseUrl(response.uri);
                            setAppStatus("ready");
                        }).catch((error) => {
                            setBaseUrl(null);
                            setAppStatus("error");
                        });
                }
            });
    };

    const processLogin = () => {
       // check if we have an authToken on initialization.
       let token = localStorage.getItem("authToken");
       if (token && token !== "") {
           // we have a token, we need to redirect to the login to authorize.
           PlexRequest.checkToken(token)
               .then(newUserInfo => {
                   if (newUserInfo.message) {
                       // Error: render to main screen to allow user to hit login.
                       // clear authtoken from storage and update appState.
                       localStorage.removeItem("authToken");

                       setUserInfo(newUserInfo);
                       setAppStatus("loggedout");
                   } else {
                        let settings = SettingsUtils.loadSettingsFromStorage();
                        setSettings({ serverIdentifier: settings.serverIdentifier, librarySection: settings.librarySection });

                        setUserInfo(newUserInfo);
                   }
           });

       } else {
           // render to main screen to allow user to hit login.
           setUserInfo(null);
           setAppStatus("loggedout");
       }
    };

    useEffect(() => {
        if (!userInfo) {
             //processLogin();
             dispatch(userActions.getToken(0));
        } else {
             // We need a user loggged in to be able to 
             // determine server access.
             //determineServerUrl();
         }
    }, [userInfo]);

    return (
        <React.Fragment>
            <Router>
                {appStatus === "login" && (
                    <Redirect to="/login" />
                )}
                {<Header userInfo={userInfo} updateAuthState={updateAuthState} />}
                <NowPlaying baseUrl={ baseUrl} userInfo={userInfo} playQueue={playQueue} updatePlayQueue={updatePlayQueue} />
                <main role="main" className="container">
                    <Switch>
                        <Route exact path="/" component={() => 
                            <React.Fragment>
                                {appStatus === "ready" && (
                                    <Redirect to="/library" />
                                )}
                                {appStatus === "error" && (
                                    <div>Error Occurred - TODO: I need to be handled.</div> 
                                )}
                                {(appStatus !== "ready" || appStatus !== "error") && (
                                    <div></div> 
                                )}
                            </React.Fragment>
                        } />
                        <Route exact path="/library" component={() => <Library baseUrl={baseUrl} userInfo={userInfo} section={settings.librarySection} />} />
                        <Route exact path="/album/:ratingKey" component={(props) => <AlbumInfo baseUrl={baseUrl} userInfo={userInfo} key={props.match.params.ratingKey} ratingKey={props.match.params.ratingKey} playQueue={updatePlayQueue} />} />
                        <Route exact path="/settings" component={(props) => <Settings userInfo={userInfo} settings={settings} updateSettingsState={updateSettingsState} /> } />
                        <Route exact path="/login" component={(props) => <LoginForm userInfo={userInfo} processLogin={processLogin} updateAuthState={updateAuthState} /> } />
                    </Switch>
                </main>
            </Router>
        </React.Fragment>
    ); 
}

export default Main;
