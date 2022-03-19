import * as actionTypes from "../actions/actionTypes";

/*
state: {
    serverIdentifier: string - the unique identifier of the server
    librarySection: string - the id of the users library
    servers: array - list of servers the user has access to
}
*/

declare global {
    
    type SettingsState = {
        serverIdentifier: string,
        librarySection: string,
        servers: Array<any>,
        libraries: Array<any>,
        currentServer: any | null,
        accessToken: string | null,
        isDarkMode: boolean
    }
}


const defaultState: SettingsState = {
    serverIdentifier: "",
    librarySection: "",
    servers: [],
    libraries: [],
    currentServer: null,
    accessToken: null,
    isDarkMode: false
};

const settingsReducer = (state: SettingsState = defaultState, action: AppAction): SettingsState => {
    switch (action.type) {
        case actionTypes.LOAD_SETTINGS:
            return { ...state, serverIdentifier: action.payload.serverIdentifier, librarySection: action.payload.librarySection, isDarkMode: action.payload.isDarkMode }
        case actionTypes.SAVE_SETTING_SERVER:
            return { ...state, serverIdentifier: action.payload, librarySection: '' };
        case actionTypes.SAVE_SETTING_LIBRARY:
            return { ...state, librarySection: action.payload };
        case actionTypes.LOAD_SERVER_LIST:
            return { ...state, servers: action.payload };
        case actionTypes.UPDATE_SELECTED_SERVER:
            return { ...state, ...action.payload };
        case actionTypes.LOAD_LIBRARY_LIST_COMPLETE:
            return { ...state, libraries: action.payload };
        case actionTypes.CHANGE_THEME:
            return { ...state, isDarkMode: action.payload };
        default:
            return state;
    };
}
export default settingsReducer;