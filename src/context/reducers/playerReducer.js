import * as actionTypes from "../actions/actionTypes";

/*
state: {
    state: string - the current play state
    currentTime:
    duration
}
*/

const defaultState = {
    mode: "stopped",
    currentTime: 0,
    duration: 0
};

const playQueueReducer = (state = defaultState, action) => {
    switch (action.type) {
        case actionTypes.CHANGE_PLAYER_STATE:
            return Object.assign({}, state, { mode: action.payload });
        case actionTypes.UPDATE_PLAYER_TIME:
            return Object.assign({}, state, { currentTime: action.payload.currentTime, duration: action.payload.duration });
        default:
            return state;
    };
}
export default playQueueReducer;