import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import Bowser from "bowser";
import type { RootState, AppDispatch } from '@/store'

import { RESOURCETYPES } from '@/utility/plex';
import * as SettingsUtils from '@/utility/settings'

import PlexJavascriptApi from '@adamskoog/jsapi-for-plex'
import type { PlexResource, PlexUser } from '@adamskoog/jsapi-for-plex/plex.types'

import { clearServerData } from './serverSlice'
import { clearActiveLibrary } from './librarySlice'
import { loadAuthSettings, loadSettingFromStorage, saveSettingToStorage, removeSettingFromStorage, SETTINGS_KEYS } from '@/utility/settings'
import { setSkipBackwardIncrement, setSkipForwardIncrement } from './playerSlice'

type AppState = 'loading' | 'ready' | 'loggedOut';

interface ThunkApi {
  dispatch: AppDispatch,
  state: RootState
}
export interface ApplicationState {
    user: PlexUser | null,
    servers: PlexResource[],
    state: AppState
}

const initialState: ApplicationState = {
    user: null,
    servers: [],
    state: 'loading'
}

interface InitParams {
  title: string,
  version: string
}
interface InitReturn {
  user: PlexUser | null,
  servers: PlexResource[],
  state: AppState
}

const initialize = createAsyncThunk<InitReturn, InitParams, ThunkApi>('application/initialize', async ({title, version}: InitParams, { getState, dispatch}) => {

    // Get our browser/client info
    const browser = Bowser.parse(window.navigator.userAgent);

    // load any saved authentication data.
    let authSettings = loadAuthSettings();

    PlexJavascriptApi.initialize({
      title,
      clientIdentifier: authSettings.clientIdentifier,
      version,
      device: browser.os.name,
      deviceName: browser.browser.name,
      platform: browser.browser.name,
    });

    // Check if we have an auth id saved, if so, we need
    // to validate the pin and get a token.
    if (authSettings.authId) {
        authSettings.token = await PlexJavascriptApi.validatePin(authSettings.authId);
        removeSettingFromStorage(SETTINGS_KEYS.loginRedirectId);
        saveSettingToStorage(SETTINGS_KEYS.token, authSettings.token);
    }

    if (authSettings.token) {
      // TODO: how do we handle an invalid token - this needs work.
      const user =  await PlexJavascriptApi.validateToken(authSettings.token);

      // We have a valid user, get the servers they have access to.
      const resources = await PlexJavascriptApi.getResources(RESOURCETYPES.server);
      
      // Get saved skip settings for local storage.
      const skipBack = loadSettingFromStorage(SETTINGS_KEYS.skipBackwardIncrement)
      const skipForward = loadSettingFromStorage(SETTINGS_KEYS.skipForwardIncrement)
      if (skipBack) dispatch(setSkipBackwardIncrement(parseInt(skipBack)));
      if (skipForward) dispatch(setSkipForwardIncrement(parseInt(skipForward)));

      return {
          user,
          servers: resources,
          state: 'ready'
      }
    }
    
    return {
      user: null,
      servers: [],
      state: 'loggedOut'
    }
});

interface SwitchUserReturn {
  user: PlexUser,
  servers: PlexResource[]
}
const switchUser = createAsyncThunk<SwitchUserReturn, PlexUser, ThunkApi>('application/switch-user', async (user, { getState, dispatch}) => {

      dispatch(clearServerData());
      dispatch(clearActiveLibrary());

      // We have a valid user, get the servers they have access to.
      const resources = await PlexJavascriptApi.getResources(RESOURCETYPES.server);

      return {
          user,
          servers: resources
      }
});

export const applicationSlice = createSlice({
  name: 'application',
  initialState,
  reducers: {
    logout: (state) => {
      SettingsUtils.clearSettings()

      state.user = null
      state.servers = []
      state.state = 'loggedOut'
    }
  },
  extraReducers: (builder) => {
    builder
        .addCase(initialize.pending, (state) => {
            state.state = 'loading'
            state.user = null
            state.servers = []
          })
        .addCase(initialize.fulfilled, (state, { payload }) => {
          state.user = payload.user
          state.servers = payload.servers
          state.state = payload.state
        })
        .addCase(initialize.rejected, (state) => {
          SettingsUtils.clearSettings()

          state.user = null
          state.servers = []       
          state.state = 'loggedOut'
        })
        .addCase(switchUser.pending, (state) => {
        })
        .addCase(switchUser.fulfilled, (state, { payload }) => {
          state.user = payload.user
          state.servers = payload.servers
        })
        .addCase(switchUser.rejected, (state) => {
          SettingsUtils.clearSettings()

          state.user = null
          state.servers = []
          state.state = 'loggedOut'
        })
  }
})

// Action creators are generated for each case reducer function
const { logout } = applicationSlice.actions

export { initialize, switchUser, logout }

export default applicationSlice.reducer