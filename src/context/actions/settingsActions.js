import * as actionTypes from "./actionTypes";
import * as SettingsUtils from "../../utility/settings";
import { RESOURCETYPES, getResources, findServerBaseUrl, getLibraries as getPlexLibraries } from "../../plex/Api";

export const loadSettingsValues = () => {
    const settings = SettingsUtils.loadSettingsFromStorage();
    return {
        type: actionTypes.LOAD_SETTINGS,
        payload: {
            serverIdentifier: settings.serverIdentifier ?? "",
            librarySection: settings.librarySection ?? ""
        }
    };
}

export const setServerSetting = (serverId) => {
    return async (dispatch, getState) => {

        // Update the config value on server setting change.
        SettingsUtils.saveSettingToStorage(SettingsUtils.SETTINGS_KEYS.serverId, serverId);
        SettingsUtils.saveSettingToStorage(SettingsUtils.SETTINGS_KEYS.libraryId, '');

        dispatch({ type: actionTypes.SAVE_SETTING_SERVER, payload: serverId });
        dispatch(setActiveServer());
    };
}

export const setLibrarySetting = (libraryId) => {
    SettingsUtils.saveSettingToStorage(SettingsUtils.SETTINGS_KEYS.libraryId, libraryId);
    
    return {
        type: actionTypes.SAVE_SETTING_LIBRARY,
        payload: libraryId
    };
}







// Begin refactor of get server flow - we need to do
// let in these actions, this action will only get the server
// resources from plex.tv.
export const getServers = () => {
    return async (dispatch, getState) => {
        // Get the current state and retrieve the authToken.
        dispatch(loadSettingsValues());

        const state = getState();
        const authToken = state.application.authToken;

        // Call our plex api to get the resources.
        if (authToken) {
        const servers = await getResources(authToken, RESOURCETYPES.server);
            dispatch({ type: actionTypes.LOAD_SERVER_LIST, payload: servers })
            dispatch(setActiveServer());
        }

        // TODO: reset state to no server active???
    };
}

const matchServer = (serverId, resources) => {
    for (let i = 0; i < resources.length; i++) {
        if (serverId === resources[i].clientIdentifier) {
            return resources[i];
        }
    }
    return null;
}

export const setActiveServer = () => {
    return (dispatch, getState) => {
        const state = getState();
        const serverId = state.settings.serverIdentifier;
        const resources = state.settings.servers;
        if (!serverId) {
            dispatch({ type: actionTypes.UPDATE_SELECTED_SERVER, payload: null });
            dispatch({ type: actionTypes.SET_SERVER_URL, payload: null });   
        } else {
            const server = matchServer(serverId, resources);
            if (server) {
                dispatch({ type: actionTypes.UPDATE_SELECTED_SERVER, payload: server });
                dispatch(setServerBaseUrl());
            } else {
                dispatch({ type: actionTypes.UPDATE_SELECTED_SERVER, payload: null });     
                dispatch({ type: actionTypes.SET_SERVER_URL, payload: null });   
            }
        }

    };
}

export const setServerBaseUrl = () => {
    return async (dispatch, getState) => {
        // Get the current state and retrieve the authToken.
        const state = getState();
        const server = state.settings.currentServer;

        const baseUrl = await findServerBaseUrl(server);
        dispatch({ type: actionTypes.SET_SERVER_URL, payload: baseUrl.uri});
        dispatch(getLibraries());
    };
}

export const getLibraries = () => {
    return async (dispatch, getState) => {
        let state = getState();

        const baseUrl = state.application.baseUrl;
        const resource = state.settings.currentServer;

        if (resource) {
            const libraries = await getPlexLibraries(baseUrl, resource.accessToken);
            dispatch({ type: actionTypes.LOAD_LIBRARY_LIST_COMPLETE, payload: libraries});
        }
    };
}