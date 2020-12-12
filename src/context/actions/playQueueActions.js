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