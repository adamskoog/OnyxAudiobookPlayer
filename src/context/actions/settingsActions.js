import * as actionTypes from "./actionTypes";
import SettingsUtils from "../../utility/settings";
import * as PlexApi from "../../plex/Api";

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


export const setSettingServer = (serverId) => {
    return (dispatch, getState) => {
        let state = getState();

        let resource = null;
        const servers = state.settings.servers;
        if (servers && servers.length !== 0 ) {
            // We have a server selected -- match to our resource list.
            resource = SettingsUtils.findResourceMatch(serverId, servers);
            dispatch({ type: actionTypes.UPDATE_SELECTED_SERVER, payload: resource });
            SettingsUtils.findServerBaseUrl(resource)
                .then(response => {
                    SettingsUtils.saveSettingToStorage("settings_serverIdentifier", serverId);
                    dispatch({ type: actionTypes.SAVE_SETTING_SERVER, payload: { serverIdentifier: serverId } });
                    dispatch({ type: actionTypes.SET_SERVER, payload: { baseUrl: response.url } });

                    // We have a base url, now we need to populate the library list.
                    SettingsUtils.saveSettingToStorage("settings_library", "");
                    dispatch({ type: actionTypes.SAVE_SETTING_LIBRARY, payload: { librarySection: "" } });

                    if (resource) {
                        dispatch({ type: actionTypes.LOAD_LIBRARY_LIST });
                        
                        SettingsUtils.loadServerLibraries(response.url, resource.accessToken)
                            .then(libresponse => {
                                dispatch({ type: actionTypes.LOAD_LIBRARY_LIST_COMPLETE, payload: libresponse });
                            })
                            .catch(error => {
                                dispatch({ type: actionTypes.LOAD_LIBRARY_LIST_ERROR });
                            });
                    }
                });
        } else {
            SettingsUtils.saveSettingToStorage("settings_serverIdentifier", serverId);
            dispatch({ type: actionTypes.SAVE_SETTING_SERVER, payload: { serverIdentifier: serverId } });
        }
    };
}

export const setSettingLibrary = (libraryId) => {
    SettingsUtils.saveSettingToStorage("settings_library", libraryId);
    return {
        type: actionTypes.SAVE_SETTING_LIBRARY,
        payload: {
            librarySection: libraryId
        }
    };
}

// Begin refactor of get server flow - we need to do
// let in these actions, this action will only get the server
// resources from plex.tv.
export const getServers = () => {
    return async (dispatch, getState) => {
        // Get the current state and retrieve the authToken.
        const state = getState();
        const authToken = state.application.authToken;

        // Call our plex api to get the resources.
        if (authToken) {
        const servers = await PlexApi.getResourcesNew(authToken, PlexApi.RESOURCETYPES.server);
            dispatch({ type: 'settings/serversLoaded', payload: servers })
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
            dispatch({ type: 'settings/serverNotSet' });
            dispatch({ type: 'application/baseUrlNotSet' });
        } else {
            const server = matchServer(serverId, resources);
            if (server) {
                dispatch({ type: 'settings/setActiveServer', payload: server });
                dispatch(setServerBaseUrl());
            } else {
                dispatch({ type: 'settings/serverNotSet' });     
                dispatch({ type: 'application/baseUrlNotSet' });         
            }
        }

    };
}

export const setServerBaseUrl = () => {
    return async (dispatch, getState) => {
        // Get the current state and retrieve the authToken.
        const state = getState();
        const server = state.settings.currentServer;

        const baseUrl = await PlexApi.findServerBaseUrl(server);
        dispatch({ type: 'application/setBaseUrl', payload: baseUrl.uri});
        dispatch(getLibraries());
    };
}

export const getLibraries = () => {
    return async (dispatch, getState) => {
        let state = getState();

        const baseUrl = state.application.baseUrl;
        const authToken = state.application.authToken;
        const resource = state.settings.currentServer;

        if (resource) {
            const libraries = await PlexApi.getLibraries(baseUrl, authToken);
            dispatch({ type: 'settings/loadLibraries', payload: libraries});
        }
    };
}