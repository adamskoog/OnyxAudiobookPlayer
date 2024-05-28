import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import type { RootState, AppDispatch } from '@/store'

import PlexJavascriptApi from '@/plex'
import type { PlexResource, PlexLibrary } from '@/plex/plex.types'

import { LIBRARYTYPES } from '@/utility/plex'
import * as SettingsUtils from '@/utility/settings'

import { setActiveLibrary, clearActiveLibrary } from './librarySlice'

export interface ServerState {
    isLoading: boolean,
    libraries: Array<PlexLibrary>,
    activeServer: PlexResource | null
}

interface ThunkApi {
    dispatch: AppDispatch,
    state: RootState
}

const initialState: ServerState = {
    isLoading: false,
    libraries: [],
    activeServer: null
}

const matchServer = (serverId: string | null, resources: Array<PlexResource> | null): PlexResource | null => {
    if (!resources) throw 'No Servers Found.'
    if (!serverId) return null;
    for (let i = 0; i < resources.length; i++) {
      if (serverId === resources[i].clientIdentifier) {
        return resources[i];
      }
    }
    return null;
};

interface ServerInitReturn {
    activeServer: PlexResource | null,
    libraries: Array<PlexLibrary>
}

const initializeServer = createAsyncThunk<ServerInitReturn, void, ThunkApi>('server/initialize', async (_, { getState, dispatch}) => {

    // Get the app settings values to see if we have a saved active server.
    const settings = SettingsUtils.loadSettingsFromStorage();
    const serverId = settings.serverIdentifier;
    const libraryId = settings.librarySection;

    // We need to get the current list of servers.
    const state = getState();

    const activeServer = matchServer(serverId, state.application.servers);
    // console.log("getServerList::matchServer::activeServer", activeServer)

    // Set our active server so we can get our libraries.
    const connection = await PlexJavascriptApi.selectServer(activeServer)

    let libraries: Array<PlexLibrary> = [];
    if (connection.uri) {
        // if we have a url - we have an active server, try to get libraries.
        libraries = await PlexJavascriptApi.getLibraries(LIBRARYTYPES.music)
    }

    if (libraryId) dispatch(setActiveLibrary(libraryId))

    return {
        activeServer,
        libraries
    }

})

interface ActiveServerReturn {
    activeServer: PlexResource | null,
    libraries: Array<PlexLibrary>
}

const setActiveServer = createAsyncThunk<ActiveServerReturn, string, ThunkApi>('server/setActiveServer', async (serverId, { getState, dispatch}) => {
    
    // Get current state to have the current list of servers.
    const state = getState();
    const activeServer = matchServer(serverId, state.application.servers);
    let libraries: Array<PlexLibrary> = []

    if (activeServer) {   
        // Remove the current library since we are changing servers.
        SettingsUtils.removeSettingFromStorage(SettingsUtils.SETTINGS_KEYS.serverId)
        dispatch(clearActiveLibrary())

        // Set our active server so we can get our libraries.
        const connection = await PlexJavascriptApi.selectServer(activeServer)

        if (connection.uri) {
            // if we have a url - we have an active server, save to storage and try to get libraries.
            SettingsUtils.saveSettingToStorage(SettingsUtils.SETTINGS_KEYS.serverId, activeServer.clientIdentifier)

            libraries = await PlexJavascriptApi.getLibraries(LIBRARYTYPES.music)
        }
    }

    return {
        activeServer,
        libraries
    };
})

export const serverSlice = createSlice({
  name: 'server',
  initialState,
  reducers: {
    clearServerData: (state) => {
        state.activeServer = null;
        state.libraries = [];
    }
  },
  extraReducers: (builder) => {
    builder
        .addCase(initializeServer.pending, (state) => {
            state.isLoading = true
            state.activeServer = null
            state.libraries = []
        })
        .addCase(initializeServer.fulfilled, (state, { payload }) => {
            state.isLoading = false
            state.activeServer = payload.activeServer
            state.libraries = payload.libraries
        })
        .addCase(initializeServer.rejected, (state) => {
            state.isLoading = false
            state.activeServer = null
            state.libraries = []
        })
        .addCase(setActiveServer.pending, (state) => {
            state.isLoading = true
            state.activeServer = null
            state.libraries = []
        })
        .addCase(setActiveServer.fulfilled, (state, { payload }) => {
            state.isLoading = false
            state.activeServer = payload.activeServer
            state.libraries = payload.libraries
        })
        .addCase(setActiveServer.rejected, (state) => {
            state.isLoading = false
            state.activeServer = null
            state.libraries = []
        })
    }
})

// Action creators are generated for each case reducer function
const { clearServerData } = serverSlice.actions

export { initializeServer, setActiveServer, clearServerData }

export default serverSlice.reducer