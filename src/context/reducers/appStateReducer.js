import * as actionTypes from "../actions/actionTypes";

/*
state: {
    applicationState: string - the current app state, value = ['ready', 'loggedout', 'loading'],
    userInfo: object - user information obtained from plex.tv),
    authToken: string - the users token - get's stored to localStorage when changed.
    authId: string - we are doing the plex.tv authentication and need to validate login
    baseUrl: string - the users server base connection url
    libraryId: string - the id of the users library
    settings: object - temporary, need storage of settings information.
}
*/

const defaultState = {
    isLoading: false,
    applicationState: "loggedout",
    user: null, 
    authToken: null,
    authId: null,
    baseUrl: null,
    settings: {
        serverIdentifier: null,
        librarySection: null
    }
};

const appStateReducer = (state = defaultState, action) => {
    switch (action.type) {
        case actionTypes.CHANGE_APP_STATE:
            return Object.assign({}, state, { applicationState: action.payload.applicationState });
        case actionTypes.SET_SERVER:
            return Object.assign({}, state, { baseUrl: action.payload.baseUrl, applicationState: "ready" });
        case actionTypes.GET_TOKEN:
            return Object.assign({}, state, { authToken: action.payload.authToken, authId: action.payload.authId, settings: action.payload.settings });
        case actionTypes.CHECK_TOKEN:
            return Object.assign({}, state, { isLoading: true });
        case actionTypes.TOKEN_VALID:
            return Object.assign({}, state, { user: action.payload.user, applicationState: "ready", isLoading: false });
        case actionTypes.TOKEN_INVALID:
            return Object.assign({}, state, { applicationState: "loggedout", isLoading: false });
        case actionTypes.LOGIN_REQUEST:
            return Object.assign({}, state, { isLoading: true });
        case actionTypes.LOGIN_REQUEST_VALIDATED:
            return Object.assign({}, state, { authId: null, authToken: action.payload.authToken });
        case actionTypes.LOGIN_REQUEST_NOT_VALID:
            return Object.assign({}, state, { applicationState: "loggedout", authId: null, isLoading: false });
        case actionTypes.USER_LOGGED_OUT:
            return Object.assign({}, state, { applicationState: "loggedout", authId: null, user: null, isLoading: false });
        case actionTypes.LOAD_SETTINGS:
        case actionTypes.SAVE_SETTING_SERVER:
        case actionTypes.SAVE_SETTING_LIBRARY:
            return Object.assign({}, state, { settings: action.payload.settings });
        default:
            return state;
    };
}
export default appStateReducer;