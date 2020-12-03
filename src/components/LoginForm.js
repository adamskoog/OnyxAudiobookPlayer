import React, { useEffect } from 'react';
import PlexRequest from '../plex/PlexRequest';
import { Redirect } from 'react-router-dom';

function LoginForm(props) {

    function validateAuthId(authId) {
        return new Promise((resolve, reject) => {
            localStorage.removeItem("login_redirect_id");

            // We need to clear the id and process the auth redirection.
            PlexRequest.validatePin(authId)
                .then(regInfo => {
                    localStorage.setItem("authToken", regInfo.authToken);
                    resolve(regInfo);
                });
        });
    };

    const checkLoginRedirect = () => {
        // check if we have an authId stored.
        var authId = localStorage.getItem("login_redirect_id");
         if (authId) {
             validateAuthId(authId)
                 .then(regInfo => {
                    props.processLogin();
                 });
        } else {
            PlexRequest.signIn()
                .then(redirectInfo => {
                    localStorage.setItem("login_redirect_id", redirectInfo.id);
                    window.location.href = redirectInfo.redirectUrl;
                });
        }
    };

    useEffect(() => {
        if (!props.userInfo)
            checkLoginRedirect();
    }, []);

    return (
        <React.Fragment>
        {props.userInfo && (
            <Redirect to="/" />
        )}
        </React.Fragment>
    );
}

export default LoginForm;
