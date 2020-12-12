import * as actionTypes from "./actionTypes";
import SettingsUtils from "../../utility/settings";

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

export const getServers = (token) => {
    return (dispatch, getState) => {
        const state = getState();
        dispatch({ type: actionTypes.LOAD_SERVER_LIST });

        SettingsUtils.loadServers(token)
            .then(response => {

                const serverId = state.settings.serverIdentifier;
                if (serverId && serverId !== "" ) {
                    const resource = SettingsUtils.findResourceMatch(serverId, response);
                    dispatch({ type: actionTypes.UPDATE_SELECTED_SERVER, payload: resource });

                    SettingsUtils.findServerBaseUrl(resource)
                    .then(response => {
                        console.log("resp", response);
                        dispatch({ type: actionTypes.SET_SERVER, payload: { baseUrl: response.url } });

                        // TODO: This really seems like it needs to be separated, but having it
                        // not load on initialzation here causes infinite loops.... :(
                        SettingsUtils.loadServerLibraries(response.url, resource.accessToken)
                            .then(libresponse => {
                                console.log("libraries", libresponse);
                                dispatch({ type: actionTypes.LOAD_LIBRARY_LIST_COMPLETE, payload: libresponse });
                            })
                            .catch(error => {
                                dispatch({ type: actionTypes.LOAD_LIBRARY_LIST_ERROR });
                            });
                    });
                }
                dispatch({ type: actionTypes.LOAD_SERVER_LIST_COMPLETE, payload: response });
            })
            .catch(error => {
                dispatch({ type: actionTypes.LOAD_SERVER_LIST_ERROR });
            });
    }
}

export const getLibraries = (serverId) => {
    return (dispatch, getState) => {
        let state = getState();

        if (serverId && serverId !== "") {
            const resource = SettingsUtils.findResourceMatch(serverId, state.settings.servers);
            if (resource) {
                dispatch({ type: actionTypes.LOAD_LIBRARY_LIST });
                
                SettingsUtils.loadServerLibraries(state.application.baseUrl, resource.accessToken)
                    .then(libresponse => {
                        dispatch({ type: actionTypes.LOAD_LIBRARY_LIST_COMPLETE, payload: libresponse });
                    })
                    .catch(error => {
                        dispatch({ type: actionTypes.LOAD_LIBRARY_LIST_ERROR });
                    });
            }
        }
    };
}