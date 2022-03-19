import * as actionTypes from "../actions/actionTypes";

/*
state: {
    queue: boolean - indicate application loading (show spinner).
    id: string - the guid of the current play queue
    index: integer - the current tracks index in the queue
}
*/

declare global {
    
    type PlayQueueState = {
        queue: Array<any>,
        id: string,
        index: number,
        currentTrack: any
    }
}

const defaultState: PlayQueueState = {
    queue: [],
    id: "",
    index: -1,
    currentTrack: null
};

const playQueueReducer = (state: PlayQueueState = defaultState, action: AppAction): PlayQueueState => {
    switch (action.type) {
        case actionTypes.SET_PLAY_QUEUE:
            return { ...state, ...action.payload, currentTrack: action.payload.currentTrack };
        case actionTypes.CHANGE_TRACK:
            return { ...state, index: action.payload.index, currentTrack: action.payload.currentTrack };
       default:
            return state;
    };
}
export default playQueueReducer;