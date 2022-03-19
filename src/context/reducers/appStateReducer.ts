import * as actionTypes from "../actions/actionTypes";

/*
state: {
    isLoading: boolean - indicate application loading (show spinner).
    applicationState: string - the current app state, value = ['ready', 'loggedout', 'loading'],
    userInfo: object - user information obtained from plex.tv),
    authToken: string - the users token - get's stored to localStorage when changed.
    authId: string - we are doing the plex.tv authentication and need to validate login
    baseUrl: string - the users server base connection url
}
*/

declare global {
    
    type ApplicationState = {
        isLoading: boolean,
        applicationState: string,
        user: any,
        authToken: string | null,
        authId: string | null,
        baseUrl: string | null
    }
}

const defaultState: ApplicationState = {
    isLoading: false,
    applicationState: "loggedout",
    user: null, 
    authToken: null,
    authId: null,
    baseUrl: null
};

const appStateReducer = (state: ApplicationState = defaultState, action: AppAction): ApplicationState => {
    switch (action.type) {
        case actionTypes.CHANGE_APP_STATE:
            return { ...state, applicationState: action.payload.applicationState };
        case actionTypes.SET_SERVER_URL:
            return { ...state, baseUrl: action.payload, applicationState: "ready" };
        case actionTypes.GET_TOKEN:
            return { ...state, authToken: action.payload.authToken, authId: action.payload.authId };
            //return { ...state, authToken: action.payload.authToken, authId: action.payload.authId, settings: action.payload.settings };
        case actionTypes.CHECK_TOKEN:
            return { ...state, isLoading: true };
        case actionTypes.TOKEN_VALID:
            return { ...state, user: action.payload.user, isLoading: false  };
        case actionTypes.TOKEN_INVALID:
            return { ...state, applicationState: "loggedout", isLoading: false };
        case actionTypes.LOGIN_REQUEST:
            return { ...state, isLoading: true };
        case actionTypes.LOGIN_REQUEST_VALIDATED:
            return { ...state, authId: null, authToken: action.payload.authToken };
        case actionTypes.LOGIN_REQUEST_NOT_VALID:
            return { ...state, applicationState: "loggedout", authId: null, isLoading: false };
        case actionTypes.USER_LOGGED_OUT:
            return { ...state, applicationState: "loggedout", authId: null, user: null, isLoading: false };
        default:
            return state;
    };
}
export default appStateReducer;