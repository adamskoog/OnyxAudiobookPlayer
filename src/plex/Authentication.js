import PlexRequest from './PlexRequest';

class PlexAuthentication
{
    // Action = GET_TOKEN
    static getAuthTokenFromStorage = () => {
        // Attempt to get the token from browser local storage.
        let token = localStorage.getItem("authToken");
        if (token && token !== "")
            return token;
        return null;
    }

    // Main.js -> processLogin
    // Action = CHECK_TOKEN
    static checkToken = (token) => {
        return new Promise((resolve, reject) => {
            PlexRequest.checkToken(token)
                .then(userInfo => {
                    if (newUserInfo.message) {
                        // Remove the token from storage.
                        localStorage.removeItem("authToken");

                        // Send rejection of promise including the error message
                        // from the authentication server: TOKEN_INVALID
                        reject({ message: userInfo.message });
                    } else {
                        // We were able to validate the token: TOKEN_VALID
                        resolve({ user: userInfo });
                    }
                });
        });
    }

    static getAuthenticationId = () => {
        let authId = localStorage.getItem("login_redirect_id");
        if (authId && authId !== "")
            return authId;
        return null;
    }

    static prepareLoginRequest = () => {
        PlexRequest.signIn()
            .then(redirectInfo => {
                localStorage.setItem("login_redirect_id", redirectInfo.id);
                resolve({ url: redirectInfo.authAppUrl });
            });
    };

    static validateAuthId(authId) {
        return new Promise((resolve, reject) => {
            localStorage.removeItem("login_redirect_id");

            // We need to clear the id and process the auth redirection.
            PlexRequest.validatePin(authId)
                .then(regInfo => {
                    localStorage.setItem("authToken", regInfo.authToken);
                    resolve({ token: regInfo.authToken });
                });
        });
    };
}

export default PlexAuthentication;