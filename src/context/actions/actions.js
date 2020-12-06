import * as actionTypes from "./actionTypes";
import PlexAuthentication from "../../plex/Authentication";

export const getToken = () => {
    
    return (dispatch, getState) => {
        var token = PlexAuthentication.getAuthTokenFromStorage() ?? null;
        console.log("finding token??", token);
        dispatch({         
            type: actionTypes.GET_TOKEN,
            payload: {
                authToken: token
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