import * as actionTypes from "./actionTypes";
import PlexAuthentication from "../../plex/Authentication";

export const setApplicationState = (applicationState) => {
    return {
        type: actionTypes.CHANGE_APP_STATE,
        payload: {
            applicationState: applicationState
        }
    };
}

export const setServerInfo = (baseUrl) => {
    return {
        type: actionTypes.SET_SERVER,
        payload: {
            baseUrl: baseUrl
        }
    };
}

export const getToken = () => {
    
    return (dispatch, getState) => {
        const token = PlexAuthentication.getAuthTokenFromStorage();
        const authId = PlexAuthentication.getAuthenticationId();

        dispatch({         
            type: actionTypes.GET_TOKEN,
            payload: {
                authToken: token,
                authId: authId
            }
        });
    };
}

export const checkToken = (token) => {
    
    return (dispatch, getState) => {

        dispatch({ type: actionTypes.CHECK_TOKEN });

        PlexAuthentication.checkToken(token)
        .then(response => {
            dispatch({ type: actionTypes.TOKEN_VALID, payload: response });
        })
        .catch(error => {
            dispatch({ type: actionTypes.TOKEN_INVALID });
        });
    };
}

export const checkAuthId = (id) => {
    
    return (dispatch, getState) => {

        dispatch({ type: actionTypes.LOGIN_REQUEST });

        PlexAuthentication.validateAuthId(id)
        .then(response => {
            dispatch({ type: actionTypes.LOGIN_REQUEST_VALIDATED, payload: { authToken: response.token }});
        })
        .catch(error => {
            dispatch({ type: actionTypes.LOGIN_REQUEST_NOT_VALID });
        });
    };
}

export const logout = () => {
    
    return (dispatch, getState) => {
        PlexAuthentication.logout();

        dispatch({         
            type: actionTypes.USER_LOGGED_OUT,
            payload: null
        });
    };
}

