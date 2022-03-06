import PlexApi from './Api';

// Action = GET_TOKEN
export const getAuthTokenFromStorage = () => {
    // Attempt to get the token from browser local storage.
    let token = localStorage.getItem("authToken");
    if (token && token !== "")
        return token;
    return null;
}
// previously 'checkToken'
// Main.js -> processLogin
// Action = CHECK_TOKEN
export const validateToken = async (token) => {

    const userInfo = await PlexApi.checkToken(token);

    if (userInfo.message) {
        localStorage.removeItem("authToken");
        return { message: userInfo.message };
    }
    return { user: userInfo };
}

export const getAuthenticationId = () => {
    let authId = localStorage.getItem("login_redirect_id");
    if (authId && authId !== "")
        return authId;
    return null;
}

export const prepareLoginRequest = async () => {
    const redirectInfo = await PlexApi.signIn();

    localStorage.setItem("login_redirect_id", redirectInfo.id);
    return { url: redirectInfo.redirectUrl };
};

export const validateAuthId = async (authId) => {
    const regInfo = await PlexApi.validatePin(authId);

    localStorage.removeItem("login_redirect_id");
    localStorage.setItem("authToken", regInfo.authToken);

    return { token: regInfo.authToken };
};

export const logout = () => {
    // Might need to do more here, clear settings??
    localStorage.removeItem("authToken");
}