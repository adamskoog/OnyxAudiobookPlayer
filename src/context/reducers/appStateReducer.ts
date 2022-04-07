import * as actionTypes from '../actions/actionTypes';

/*
state: {
    isLoading: boolean - indicate application loading (show spinner).
    applicationState: string - the current app state, value = ['ready', 'loggedout', 'loading'],
    userInfo: PlexUser | null - user information obtained from plex.tv),
    baseUrl: string - the users server base connection url
}
*/

declare global {

    type ApplicationState = {
        isLoading: boolean,
        applicationState: string,
        user: PlexUser | null,
        baseUrl: string | null
    }
}

const defaultState: ApplicationState = {
  isLoading: true,
  applicationState: 'loading',
  user: null,
  baseUrl: null,
};

const appStateReducer = (state: ApplicationState = defaultState, action: AppAction): ApplicationState => {
  switch (action.type) {
    case actionTypes.CHANGE_APP_STATE:
      return { ...state, applicationState: action.payload.applicationState };
    case actionTypes.SET_SERVER_URL:
      return { ...state, baseUrl: action.payload, applicationState: 'ready' };
    case actionTypes.CHECK_TOKEN:
      return { ...state, isLoading: true };
    case actionTypes.TOKEN_VALID:
      return { ...state, user: action.payload, isLoading: false };
    case actionTypes.TOKEN_INVALID:
      return { ...state, applicationState: 'loggedout', isLoading: false };
    case actionTypes.USER_LOGGED_OUT:
      return {
        ...state, applicationState: 'loggedout', user: null, isLoading: false,
      };
    default:
      return state;
  }
};
export default appStateReducer;
