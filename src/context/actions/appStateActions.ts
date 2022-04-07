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

    try {
      const response = await PlexTvApi.validateToken();
      dispatch({ type: actionTypes.TOKEN_VALID, payload: response });
    } catch (err) {
        dispatch({ type: actionTypes.TOKEN_INVALID });
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
