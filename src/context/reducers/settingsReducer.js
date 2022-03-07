import * as actionTypes from "../actions/actionTypes";

/*
state: {
    serverIdentifier: string - the unique identifier of the server
    librarySection: string - the id of the users library
    servers: array - list of servers the user has access to
}
*/

const defaultState = {
    serverIdentifier: "",
    librarySection: "",
    servers: [],
    libraries: [],
    currentServer: null
};

const settingsReducer = (state = defaultState, action) => {
    switch (action.type) {
        case actionTypes.LOAD_SETTINGS:
            return { ...state,  };
            return { ...state, serverIdentifier: action.payload.serverIdentifier, librarySection: action.payload.librarySection }
        case actionTypes.SAVE_SETTING_SERVER:
            return { ...state, serverIdentifier: action.payload, librarySection: '' };
        case actionTypes.SAVE_SETTING_LIBRARY:
            return { ...state, librarySection: action.payload };
        case actionTypes.LOAD_SERVER_LIST:
            return { ...state, servers: action.payload };
        case actionTypes.UPDATE_SELECTED_SERVER:
            return { ...state, currentServer: action.payload };
        case actionTypes.LOAD_LIBRARY_LIST_COMPLETE:
            return { ...state, libraries: action.payload };

        default:
            return state;
    };
}
export default settingsReducer;