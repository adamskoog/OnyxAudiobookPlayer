import * as actionTypes from './actionTypes';
import { PlexTvApi } from '../../plex/Api';

export const setApplicationState = (applicationState: string): AppAction => ({
  type: actionTypes.CHANGE_APP_STATE,
  payload: {
    applicationState,
  },
});

// TODO - refactor this out, no longer needed with new class
// based api, token will be removed from redux.
export const getToken = (): AppThunk => (dispatch, getState) => {
  const token = PlexTvApi.authToken;
  const authId = PlexTvApi.getAuthenticationId();

  dispatch({
    type: actionTypes.GET_TOKEN,
    payload: {
      authToken: token,
      authId,
    },
  });
};

export const checkToken = (): AppThunk => async (dispatch, getState) => {
    dispatch({ type: actionTypes.CHECK_TOKEN });

    const response = await PlexTvApi.validateToken();
    console.log("auth response", response);
    if (response.message) {
        dispatch({ type: actionTypes.TOKEN_INVALID });
    } else {
        dispatch({ type: actionTypes.TOKEN_VALID, payload: response });
    }
};

export const checkAuthId = (id: string): AppThunk => async (dispatch, getState) => {
  dispatch({ type: actionTypes.LOGIN_REQUEST });

  const response = await PlexTvApi.validatePin(id);
  dispatch({ type: actionTypes.LOGIN_REQUEST_VALIDATED, payload: { authToken: response.token } });

  // on error: dispatch({ type: actionTypes.LOGIN_REQUEST_NOT_VALID });
};

export const logout = (): AppThunk => (dispatch, getState) => {

  PlexTvApi.logout();

  dispatch({
    type: actionTypes.USER_LOGGED_OUT,
    payload: null,
  });
};
