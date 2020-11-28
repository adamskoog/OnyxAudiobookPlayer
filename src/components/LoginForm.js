import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PlexRequest from '../plex/PlexRequest';
import { Redirect } from 'react-router-dom';

class LoginForm extends Component {

    validateAuthId(authId) {
        return new Promise((resolve, reject) => {
            localStorage.removeItem("login_redirect_id");

            // We need to clear the id and process the auth redirection.
            PlexRequest.validatePin(authId)
                .then(authInfo => {
                    localStorage.setItem("authToken", authInfo.authToken);
                    resolve({});
                });
        });
    }

    checkLoginRedirect = () => {
        // check if we have an authId stored.
        var authId = localStorage.getItem("login_redirect_id");
        if (authId) {
            this.validateAuthId(authId)
                .then(data => {
                    this.props.processLogin();
                });
        } else {
            this.props.processLogin();
        }
    }

    componentDidMount() {       
        if (!this.props.userInfo)
            this.checkLoginRedirect();
    }

    render = () =>{
        return (
            <React.Fragment>
            {this.props.userInfo && (
                <Redirect to="/" />
            )}
            </React.Fragment>
        );
    }
}

LoginForm.propTypes = {
    userInfo: PropTypes.object,
    processLogin: PropTypes.func.isRequired,
    updateAuthState: PropTypes.func.isRequired
}

export default LoginForm;
