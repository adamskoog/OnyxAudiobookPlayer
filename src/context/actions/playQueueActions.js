import * as actionTypes from "./actionTypes";
import { v4 as uuidv4 } from 'uuid';

export const clearPlayQueue = () => {
    return {
        type: actionTypes.SET_PLAY_QUEUE,
        payload: {
            id: uuidv4(),
            queue: [],
            index: -1
        }
    };
}

export const setPlayQueue = (playQueue) => {
    const queue = playQueue ?? [];
    const index = (queue && queue.length > 0) ? 0 : -1;
    return {
        type: actionTypes.SET_PLAY_QUEUE,
        payload: {
            id: uuidv4(),
            queue: queue,
            index: index
        }
    }
}

export const nextTrackInQueue = () => {
    return (dispatch, getState) => {
        const currentState = getState();
        const nextIndex = currentState.playQueue.index + 1;
        dispatch({         
            type: actionTypes.CHANGE_TRACK,
            payload: nextIndex
        });
    }
}

export const previousTrackInQueue = () => {
    return (dispatch, getState) => {

        const currentState = getState();
        const prevIndex = currentState.playQueue.index - 1;
        if (prevIndex >= 0) {
            dispatch({         
                type: actionTypes.CHANGE_TRACK,
                payload: prevIndex
            });
        }
    }
}