import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import type { RootState, AppDispatch } from '@/store'

import PlexJavascriptApi, { RESOURCETYPES } from '@/plex'

import * as SettingsUtils from '@/utility/settings'
import type { PlexResource, PlexUser } from '@/types/plex.types'

import { clearServerData } from './serverSlice'
import { clearActiveLibrary } from './librarySlice'
import { loadSettingFromStorage, SETTINGS_KEYS } from '@/utility/settings'
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

interface InitReturn {
  user: PlexUser | null,
  servers: PlexResource[],
  state: AppState
}

const initialize = createAsyncThunk<InitReturn, void, ThunkApi>('application/initialize', async (_, { getState, dispatch}) => {

    await PlexJavascriptApi.initialize();

    if (!PlexJavascriptApi.isLoggedOut) {
        // TODO: how do we handle an invalid token - this needs work.
        const user = await PlexJavascriptApi.validateToken();

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

    // console.debug("No auth details found - set as logged out state.");
    return {
        user: null,
        servers: [],
        state: 'loggedOut'
    }
})

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