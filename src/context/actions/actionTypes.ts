export const CHANGE_APP_STATE: string = "application/changeState";

export const SET_SERVER_URL: string = "application/setBaseUrl";

// Main.js -> processLogin
// User has token, we need to begin the async check
export const CHECK_TOKEN: string = "authentication/checkUserToken";
// Users token is valid, set state as logged in.
export const TOKEN_VALID: string = "authentication/tokenIsValid";
// Users token is invalid/doesn't exist, user is not logged in.
export const TOKEN_INVALID: string = "authentication/tokenIsInvalid";


// LoginForm -> checkLoginRedirect
// User has requested login
export const LOGIN_REQUEST: string = "authentication/userLoginRequest";
// We have validated the users login, we have a token
export const LOGIN_REQUEST_VALIDATED: string = "authentication/loginRequestValidated";
// We could not validate the login request, error state?
export const LOGIN_REQUEST_NOT_VALID: string = "authentication/loginRequestNotValid";

// Header.js -> logout
// This is synchonous:
//  * Throw away authToken
//  * Remove authToken from localStorage
//  * Update applicationState to 'loggedout'
export const USER_LOGGED_OUT: string = "authentication/userLoggedOut";

// Get the current auth token of the user.
export const GET_TOKEN: string = "authentication/getUserAuthToken";

export const UPDATE_SELECTED_SERVER: string = "updateSelectedServer";

export const LOAD_SETTINGS: string = "settings/loadSettings";
export const SAVE_SETTING_SERVER: string = "settings/updateSettingServer";
export const SAVE_SETTING_LIBRARY: string = "settings/updateSettingLibrary";

export const LOAD_SERVER_LIST: string = "settings/loadServerList";
export const LOAD_SERVER_LIST_COMPLETE: string = "settings/loadServerListComplete";
export const LOAD_SERVER_LIST_ERROR: string = "settings/loadServerListError";

export const LOAD_LIBRARY_LIST: string = "settings/loadLibraryList";
export const LOAD_LIBRARY_LIST_COMPLETE: string = "settings/loadLibraryListComplete";
export const LOAD_LIBRARY_LIST_ERROR: string = "settings/loadLibraryListError";

export const CHANGE_THEME: string = 'settings/changeTheme';

// Play Queue
export const SET_PLAY_QUEUE: string = "player/setPlayQueue";
export const CHANGE_TRACK: string = "player/changeTrack";

export const CHANGE_PLAYER_STATE: string = "player/changePlayerState";
export const UPDATE_PLAYER_TIME: string = "player/updatePlayerTime";


// Library
export const SET_LIBRARY_LOADING: string = "libary/setLoading";
export const SET_LIBRARY_DISPLAY_TYPE: string = "libary/setDisplayType";
export const SET_LIBRARY_SORT_TYPE: string = "libary/setSortOrder";
export const SET_LIBRARY_ITEMS: string = "libary/setLibraryItems";