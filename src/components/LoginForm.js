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
                .then(regInfo => {
                    localStorage.setItem("authToken", regInfo.authToken);
                    resolve(regInfo);
                });
        });
    }

    checkLoginRedirect = () => {
        // check if we have an authId stored.
        var authId = localStorage.getItem("login_redirect_id");
         if (authId) {
             this.validateAuthId(authId)
                 .then(regInfo => { 
                    console.log("regInfo", regInfo);
                    this.props.processLogin();
                 });
        } else {
            PlexRequest.signIn()
                .then(redirectInfo => {
                    console.log("store redirect", redirectInfo);
                    localStorage.setItem("login_redirect_id", redirectInfo.id);
                    window.location.href = redirectInfo.redirectUrl;
                });
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
