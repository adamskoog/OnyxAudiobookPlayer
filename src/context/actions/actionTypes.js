export const CHANGE_APP_STATE = "application/changeState";

export const SET_SERVER_URL = "application/setBaseUrl";

// Main.js -> processLogin
// User has token, we need to begin the async check
export const CHECK_TOKEN = "authentication/checkUserToken";
// Users token is valid, set state as logged in.
export const TOKEN_VALID = "authentication/tokenIsValid";
// Users token is invalid/doesn't exist, user is not logged in.
export const TOKEN_INVALID = "authentication/tokenIsInvalid";


// LoginForm -> checkLoginRedirect
// User has requested login
export const LOGIN_REQUEST = "authentication/userLoginRequest";
// We have validated the users login, we have a token
export const LOGIN_REQUEST_VALIDATED = "authentication/loginRequestValidated";
// We could not validate the login request, error state?
export const LOGIN_REQUEST_NOT_VALID = "authentication/loginRequestNotValid";

// Header.js -> logout
// This is synchonous:
//  * Throw away authToken
//  * Remove authToken from localStorage
//  * Update applicationState to 'loggedout'
export const USER_LOGGED_OUT = "authentication/userLoggedOut";

// Get the current auth token of the user.
export const GET_TOKEN = "authentication/getUserAuthToken";

export const UPDATE_SELECTED_SERVER = "updateSelectedServer";

export const LOAD_SETTINGS = "settings/loadSettings";
export const SAVE_SETTING_SERVER = "settings/updateSettingServer";
export const SAVE_SETTING_LIBRARY = "settings/updateSettingLibrary";

export const LOAD_SERVER_LIST = "settings/loadServerList";
export const LOAD_SERVER_LIST_COMPLETE = "settings/loadServerListComplete";
export const LOAD_SERVER_LIST_ERROR = "settings/loadServerListError";

export const LOAD_LIBRARY_LIST = "settings/loadLibraryList";
export const LOAD_LIBRARY_LIST_COMPLETE = "settings/loadLibraryListComplete";
export const LOAD_LIBRARY_LIST_ERROR = "settings/loadLibraryListError";

// Play Queue
export const SET_PLAY_QUEUE = "player/setPlayQueue";
export const CHANGE_TRACK = "player/changeTrack";

export const CHANGE_PLAYER_STATE = "player/changePlayerState";
export const UPDATE_PLAYER_TIME = "player/updatePlayerTime";


// Library
export const SET_LIBRARY_LOADING = "libary/setLoading";
export const SET_LIBRARY_DISPLAY_TYPE = "libary/setDisplayType";
export const SET_LIBRARY_SORT_TYPE = "libary/setSortOrder";
export const SET_LIBRARY_ITEMS = "libary/setLibraryItems";