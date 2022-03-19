import * as actionTypes from './actionTypes';

export const changePlayState = (state: string): AppAction => ({
  type: actionTypes.CHANGE_PLAYER_STATE,
  payload: state,
});

export const changePlayerTime = (currentTime: number, duration: number): AppAction => ({
  type: actionTypes.UPDATE_PLAYER_TIME,
  payload: {
    currentTime,
    duration,
  },
});

export const PlayState = {
  PLAY_STATE_PLAYING: 'playing',
  PLAY_STATE_PAUSED: 'paused',
  PLAY_STATE_STOPPED: 'stopped',
};
