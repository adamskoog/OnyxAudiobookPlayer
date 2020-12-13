import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Switch, Route  } from 'react-router-dom';

import * as appActions from "../context/actions/appStateActions";
import * as settingsActions from "../context/actions/settingsActions";

import Header from './Header';
// import NowPlaying from './player/NowPlaying';
import Settings from './settings/Settings';
import Library from './library/Library';
// import Album from './album/Album';

import PlexAuthentication from "../plex/Authentication";

const mapStateToProps = state => {
    return { 
        isLoading: state.application.isLoading,
        applicationState: state.application.applicationState,
        user: state.application.user, 
        authToken: state.application.authToken,
        authId: state.application.authId,
        baseUrl: state.application.baseUrl,
        librarySection: state.settings.librarySection,
    };
};

 const mapDispatchToProps = dispatch => {
    return {
        logout: () => dispatch(appActions.logout()),
        getToken: () => dispatch(appActions.getToken()),
        checkToken: token => dispatch(appActions.checkToken(token)),
        checkAuthId: authId => dispatch(appActions.checkAuthId(authId)),
        loadSettingsValues: () => dispatch(settingsActions.loadSettingsValues()),
        getServers: authToken => dispatch(settingsActions.getServers(authToken))
    };
};
function ConnectedMain(props) {

    const doUserLogin = () => {
        PlexAuthentication.prepareLoginRequest()
            .then((response) => {
                window.location.href = response.url;
            });
    };

    useEffect(() => {
        // Cannot load fully if no library section is set.
        if (props.authToken) {
            props.getServers(props.authToken);
        }
    }, [props.authToken, props.librarySection]);

    useEffect(() => {    
        if (!props.user) {
             // We have no user logged in, check for tokens.
             props.getToken();
        } else
            props.loadSettingsValues();
    }, [props.user]);

    useEffect(() => {
        if (props.authToken) {
            // We have a token stored, attempt to authenticate.
             props.checkToken(props.authToken);
        } else if (props.authId) {
            // We have been redirected and now have an authorization id to handle.
            props.checkAuthId(props.authId);
        }
    }, [props.authToken, props.authId]);

    return (
        <React.Fragment>
            <Router>
                <Header userInfo={props.user} doUserLogin={doUserLogin} doUserLogout={props.logout} />
                <main role="main" className="justify-center">
                    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <Switch>
                        <Route exact path="/" component={() => <Library baseUrl={props.baseUrl} userInfo={props.user} section={props.librarySection} />} />
                        {/* <Route exact path="/album/:ratingKey" component={(comprops) => 
                            <Album key={comprops.match.params.ratingKey} ratingKey={comprops.match.params.ratingKey} />
                        }/> */}
                        <Route exact path="/settings" component={() => <Settings /> } />
                    </Switch>
                    </div>
                </main>
                {/* <NowPlaying />
                <div className={(props.isLoading) ? "loader loading" : "loader"}>
                    <div className="d-flex justify-content-center">
                        <div className="spinner-border" style={{width: "3rem", height: "3rem"}} role="status"></div>
                    </div>
                </div> */}
            </Router>
        </React.Fragment>
    ); 
}

const Main = connect(mapStateToProps, mapDispatchToProps)(ConnectedMain);

export default Main;
