import * as actionTypes from "./actionTypes";

export const changePlayState = (state) => {
    return {
        type: actionTypes.CHANGE_PLAYER_STATE,
        payload: state
    };
}

export const changePlayerTime = (currentTime, duration) => {
    return {
        type: actionTypes.UPDATE_PLAYER_TIME,
        payload: {
            currentTime: currentTime,
            duration: duration
        }
    };
}

export const PlayState = {
    PLAY_STATE_PLAYING: "playing",
    PLAY_STATE_PAUSED: "paused",
    PLAY_STATE_STOPPED: "stopped"
}