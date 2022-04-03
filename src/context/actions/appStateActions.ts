import * as actionTypes from './actionTypes';
import { PlexTvApi } from '../../plex/Api';

export const setApplicationState = (applicationState: string): AppAction => ({
  type: actionTypes.CHANGE_APP_STATE,
  payload: {
    applicationState,
  },
});

export const checkToken = (): AppThunk => async (dispatch, getState) => {
    dispatch({ type: actionTypes.CHECK_TOKEN });

    const response = await PlexTvApi.validateToken();
    if (response.message) {
        dispatch({ type: actionTypes.TOKEN_INVALID });
    } else {
        dispatch({ type: actionTypes.TOKEN_VALID, payload: response });
    }
};

// export const checkAuthId = (id: string): AppThunk => async (dispatch, getState) => {
//   dispatch({ type: actionTypes.LOGIN_REQUEST });

//   const response = await PlexTvApi.validatePin(id);
//   dispatch({ type: actionTypes.LOGIN_REQUEST_VALIDATED, payload: { authToken: response.token } });

//   // on error: dispatch({ type: actionTypes.LOGIN_REQUEST_NOT_VALID });
// };

export const logout = (): AppThunk => (dispatch, getState) => {

  PlexTvApi.logout();

  dispatch({
    type: actionTypes.USER_LOGGED_OUT,
    payload: null,
  });
};
