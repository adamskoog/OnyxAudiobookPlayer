import * as actionTypes from "./actionTypes";
import { getAuthTokenFromStorage, getAuthenticationId, validateToken, validateAuthId, logout as authLogout } from "../../plex/Authentication";

export const setApplicationState = (applicationState) => {
    return {
        type: actionTypes.CHANGE_APP_STATE,
        payload: {
            applicationState: applicationState
        }
    };
}

export const getToken = () => {
    
    return (dispatch, getState) => {
        const token = getAuthTokenFromStorage();
        const authId = getAuthenticationId();

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
    
    return async (dispatch, getState) => {

        dispatch({ type: actionTypes.CHECK_TOKEN });

        const response = await validateToken(token);
        dispatch({ type: actionTypes.TOKEN_VALID, payload: response });

        // on error: dispatch({ type: actionTypes.TOKEN_INVALID });
    };
}

export const checkAuthId = (id) => {
    
    return async (dispatch, getState) => {

        dispatch({ type: actionTypes.LOGIN_REQUEST });

        const response = await validateAuthId(id);
        dispatch({ type: actionTypes.LOGIN_REQUEST_VALIDATED, payload: { authToken: response.token }});

        // on error: dispatch({ type: actionTypes.LOGIN_REQUEST_NOT_VALID });
    };
}

export const logout = () => {
    return (dispatch, getState) => {
        authLogout();

        dispatch({         
            type: actionTypes.USER_LOGGED_OUT,
            payload: null
        });
    };
}

