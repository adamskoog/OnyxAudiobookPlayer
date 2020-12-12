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
            return Object.assign({}, state, { serverIdentifier: action.payload.serverIdentifier, librarySection: action.payload.librarySection });
        case actionTypes.SAVE_SETTING_SERVER:
            return Object.assign({}, state, { serverIdentifier: action.payload.serverIdentifier });
        case actionTypes.SAVE_SETTING_LIBRARY:
            return Object.assign({}, state, { librarySection: action.payload.librarySection });
        case actionTypes.LOAD_SERVER_LIST:
            return state;
        case actionTypes.LOAD_SERVER_LIST_COMPLETE:
            return Object.assign({}, state, { servers: action.payload });
        case actionTypes.LOAD_SERVER_LIST_ERROR:
            return Object.assign({}, state, { servers: [] });
        case actionTypes.UPDATE_SELECTED_SERVER:
            return Object.assign({}, state, { currentServer: action.payload });
        case actionTypes.LOAD_LIBRARY_LIST:
            return state;
        case actionTypes.LOAD_LIBRARY_LIST_COMPLETE:
            return Object.assign({}, state, { libraries: action.payload });
        case actionTypes.LOAD_LIBRARY_LIST_ERROR:
            return Object.assign({}, state, { libraries: [] });
        default:
            return state;
    };
}
export default settingsReducer;