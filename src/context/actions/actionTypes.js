export const CHANGE_APP_STATE = "changeApplicationState";

export const SET_SERVER_URL = "application/setBaseUrl";

// Main.js -> processLogin
// User has token, we need to begin the async check
export const CHECK_TOKEN = "checkUserToken";
// Users token is valid, set state as logged in.
export const TOKEN_VALID = "tokenIsValid";
// Users token is invalid/doesn't exist, user is not logged in.
export const TOKEN_INVALID = "tokenIsInvalid";


// LoginForm -> checkLoginRedirect
// User has requested login
export const LOGIN_REQUEST = "userLoginRequest";
// We have validated the users login, we have a token
export const LOGIN_REQUEST_VALIDATED = "loginRequestValidated";
// We could not validate the login request, error state?
export const LOGIN_REQUEST_NOT_VALID = "loginRequestNotValid";

// Header.js -> logout
// This is synchonous:
//  * Throw away authToken
//  * Remove authToken from localStorage
//  * Update applicationState to 'loggedout'
export const USER_LOGGED_OUT = "userLoggedOut";

// Get the current auth token of the user.
export const GET_TOKEN = "getUserAuthToken";


export const UPDATE_SELECTED_SERVER = "updateSelectedServer";

export const LOAD_SETTINGS = "loadSettings";
export const SAVE_SETTING_SERVER = "updateSettingServer";
export const SAVE_SETTING_LIBRARY = "updateSettingLibrary";

export const LOAD_SERVER_LIST = "loadServerList";
export const LOAD_SERVER_LIST_COMPLETE = "loadServerListComplete";
export const LOAD_SERVER_LIST_ERROR = "loadServerListError";

export const LOAD_LIBRARY_LIST = "loadLibraryList";
export const LOAD_LIBRARY_LIST_COMPLETE = "loadLibraryListComplete";
export const LOAD_LIBRARY_LIST_ERROR = "loadLibraryListError";


// Play Queue
export const SET_PLAY_QUEUE = "setPlayQueue";
export const CHANGE_TRACK = "changeTrack";

export const CHANGE_PLAYER_STATE = "changePlayerState";
export const UPDATE_PLAYER_TIME = "updatePlayerTime";