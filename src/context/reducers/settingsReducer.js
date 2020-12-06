import * as actionTypes from "../actions/actionTypes";

/*
state: {
    serverIdentifier: string - the unique identifier of the server
    librarySection: string - the id of the users library
}
*/

const defaultState = {
    serverIdentifier: null,
    librarySection: null
};

const settingsReducer = (state = defaultState, action) => {
    switch (action.type) {
        case actionTypes.LOAD_SETTINGS:
            return Object.assign({}, state, { serverIdentifier: action.payload.serverIdentifier, librarySection: action.payload.librarySection });
        case actionTypes.SAVE_SETTING_SERVER:
            return Object.assign({}, state, { serverIdentifier: action.payload.serverIdentifier });
        case actionTypes.SAVE_SETTING_LIBRARY:
            return Object.assign({}, state, { librarySection: action.payload.librarySection });
        default:
            return state;
    };
}
export default settingsReducer;