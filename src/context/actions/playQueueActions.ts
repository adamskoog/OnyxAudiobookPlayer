import * as actionTypes from "./actionTypes";
import { v4 as uuidv4 } from 'uuid';

export const clearPlayQueue = (): AppAction => {
    return {
        type: actionTypes.SET_PLAY_QUEUE,
        payload: {
            id: uuidv4(),
            queue: [],
            index: -1,
            currentTrack: null
        }
    };
}

export const setPlayQueue = (playQueue: Array<any>): AppAction => {
    const queue = playQueue ?? [];
    const index = (queue && queue.length > 0) ? 0 : -1;
    return {
        type: actionTypes.SET_PLAY_QUEUE,
        payload: {
            id: uuidv4(),
            queue: queue,
            index: index,
            currentTrack: queue[index]
        }
    }
}

export const nextTrackInQueue = (): AppThunk => {
    return (dispatch, getState) => {
        const currentState = getState();
        const nextIndex = currentState.playQueue.index + 1;
        const queue = currentState.playQueue.queue;
        dispatch({         
            type: actionTypes.CHANGE_TRACK,
            payload: {
                index: nextIndex,
                currentTrack: queue[nextIndex]
            }
        });
    }
}

export const previousTrackInQueue = (): AppThunk => {
    return (dispatch, getState) => {

        const currentState = getState();
        const prevIndex = currentState.playQueue.index - 1;
        const queue = currentState.playQueue.queue;
        if (prevIndex >= 0) {
            dispatch({         
                type: actionTypes.CHANGE_TRACK,
                payload: {
                    index: prevIndex,
                    currentTrack: queue[prevIndex]
                }
            });
        }
    }
}