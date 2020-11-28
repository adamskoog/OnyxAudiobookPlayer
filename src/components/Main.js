import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect  } from 'react-router-dom';

import PlexRequest from '../plex/PlexRequest';
import SettingsUtils from '../utility/settings';

import Header from './Header';
import LoginForm from './LoginForm';
import Loading from './Loading';
import NowPlaying from './NowPlaying';
import Settings from './Settings';
import Library from './Library';
import AlbumInfo from './AlbumInfo';

class Main extends Component {

    state = {
        baseUrl: null,
        appState: "loading",
        userInfo: null,
        nowPlaying: null,
        serverIdentifier: null,
        librarySection: null
    }

    playTrack = (trackInfo) => {
        this.setState({ nowPlaying: trackInfo })
    }

    updateAuthState = (userInfo, appState) => {
        this.setState({ userInfo: userInfo, appState: appState });
    }

    updateSettingsState = (settings) => {
        this.setState(settings);
    }

    processLogin = () => {
       // check if we have an authToken on initialization.
       let token = localStorage.getItem("authToken");
       if (token && token !== "") {
           // we have a token, we need to redirect to the login to authorize.
           PlexRequest.checkToken(token)
               .then(userInfo => {
                   if (userInfo.message) {
                       // redirect to login prompt, is there a better way to handle this redirection?
                       // clear authtoken from storage and update appState.
                       localStorage.removeItem("authToken");
                       this.setState({ userInfo: null, appState: "loggedout" });
                   } else {
                        let settings = SettingsUtils.loadSettingsFromStorage();
                        this.setState({ userInfo: userInfo, librarySection: settings.librarySection, serverIdentifier: settings.serverIdentifier, appState: "ready" });
                   }
           });

       } else {
           // render to main screen to allow user to hit login.
           this.setState({ appState: "loggedout" });
       }
    }

    componentDidMount() {
        this.processLogin();
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.nowPlaying && this.state.baseUrl && this.state.userInfo) {
            this.nowPlaying.updatePlayInfo(this.state.baseUrl, this.state.userInfo, this.state.nowPlaying);
        }
    }

    render() {
        return (
            <React.Fragment>
                {(this.state.appState === "ready" || this.state.appState === "login" || this.state.appState === "loggedout") && (
                    <React.Fragment>
                        <Router>
                            {this.state.appState === "login" && (
                                <Redirect to="/login" />
                            )}
                            {<Header userInfo={this.state.userInfo} updateAuthState={this.updateAuthState} />}
                            <NowPlaying ref={nowPlaying => {this.nowPlaying = nowPlaying}} baseUrl={ this.state.baseUrl} userInfo={this.state.userInfo} />
                            <main role="main" className="container">
                                <Switch>
                                    {this.state.userInfo && (
                                    <Route exact path="/" component={() => <Library baseUrl={ this.state.baseUrl} userInfo={this.state.userInfo} section={this.state.librarySection} />} />
                                    )}
                                    {!this.state.userInfo && (
                                    <Route exact path="/" component={() => <div>Empty</div> } />
                                    )}
                                    <Route exact path="/album/:ratingKey" component={(props) => <AlbumInfo baseUrl={this.state.baseUrl} userInfo={this.state.userInfo} key={props.match.params.ratingKey} ratingKey={props.match.params.ratingKey} playTrack={this.playTrack} />} />
                                    <Route exact path="/settings" component={(props) => <Settings userInfo={this.state.userInfo} updateSettingsState={this.updateSettingsState} /> } />
                                    <Route exact path="/login" component={(props) => <LoginForm userInfo={this.state.userInfo} processLogin={this.processLogin} updateAuthState={this.updateAuthState} /> } />
                                </Switch>
                            </main>
                        </Router>
                    </React.Fragment>
                )}
                {this.state.appState === "loading" && (
                    <Loading />
                )}
            </React.Fragment>
        ); 
    }
}

export default Main;
