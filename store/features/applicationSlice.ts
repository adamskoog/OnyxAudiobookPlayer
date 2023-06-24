import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import PlexJavascriptApi, { RESOURCETYPES } from '@/plex'

import * as SettingsUtils from '@/utility/settings'
import type { PlexResource, PlexUser } from '@/types/plex.types'

type AppState = 'loading' | 'ready' | 'loggedOut';

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

const initialize = createAsyncThunk<InitReturn, void>('application/initialize', async () => {

    await PlexJavascriptApi.initialize();

    if (!PlexJavascriptApi.isLoggedOut) {
        // TODO: how do we handle an invalid token - this needs work.
        const user = await PlexJavascriptApi.validateToken();

        // We have a valid user, get the servers they have access to.
        const resources = await PlexJavascriptApi.getResources(RESOURCETYPES.server);

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
  }
})

// Action creators are generated for each case reducer function
const { logout } = applicationSlice.actions

export { initialize, logout }

export default applicationSlice.reducer