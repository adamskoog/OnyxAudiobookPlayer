import * as actionTypes from "../actions/actionTypes";

/*
state: {
    queue: boolean - indicate application loading (show spinner).
    id: string - the guid of the current play queue
    index: integer - the current tracks index in the queue
}
*/

const defaultState = {
    queue: [],
    id: "",
    index: -1,
    currentTrack: null
};

const playQueueReducer = (state = defaultState, action) => {
    switch (action.type) {
        case actionTypes.SET_PLAY_QUEUE:
            return { ...state, ...action.payload, currentTrack: action.payload.currentTrack  };
        case actionTypes.CHANGE_TRACK:
            return { ...state, index: action.payload.index };
       default:
            return state;
    };
}
export default playQueueReducer;