import * as actionTypes from "../actions/actionTypes";

/*
state: {
    applicationState: string - the current app state, value = ['ready', 'loggedout', 'loading'],
    userInfo: object - user information obtained from plex.tv),
    authToken: string - the users token - get's stored to localStorage when changed.
    authId: string - we are doing the plex.tv authentication and need to validate login
}
*/

const defaultState = {
    isLoading: false,
    applicationState: "loggedout",
    userInfo: null, 
    authToken: null,
    authId: null
};

const userInfoReducer = (state = defaultState, action) => {
    switch (action.type) {
        case actionTypes.GET_TOKEN:
            return Object.assign({}, state, { authToken: action.payload.authToken });
        case actionTypes.CHECK_TOKEN:
            return Object.assign({}, state, { isLoading: true });
        case actionTypes.TOKEN_VALID:
            return Object.assign({}, state, { userInfo: action.payload.user, applicationState: "ready", isLoading: false });
        case actionTypes.TOKEN_INVALID:
            return Object.assign({}, state, { applicationState: "loggedout", isLoading: false });
        default:
            return state;
    };
}
export default userInfoReducer;