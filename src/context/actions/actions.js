import * as actionTypes from "./actionTypes";
import PlexAuthentication from "../../plex/Authentication";

export const getToken = () => {
    
    var token = PlexAuthentication.getAuthTokenFromStorage();
    return {
        type: actionTypes.GET_TOKEN,
        payload: {
            authToken: token
        }
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