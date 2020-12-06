import * as actionTypes from "./actionTypes";
import PlexAuthentication from "../../plex/Authentication";
import SettingsUtils from "../../utility/settings";

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
        const settings = SettingsUtils.loadSettingsFromStorage();

        dispatch({         
            type: actionTypes.GET_TOKEN,
            payload: {
                authToken: token,
                authId: authId,
                serverIdentifier: settings.serverIdentifier,              // TODO: This is probably a temporary spot.
                librarySection: settings.librarySection 
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