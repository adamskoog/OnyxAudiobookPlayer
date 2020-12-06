import * as actionTypes from "./actionTypes";
import SettingsUtils from "../../utility/settings";

export const loadSettingsValues = () => {
    const settings = SettingsUtils.loadSettingsFromStorage();

    return {
        type: actionTypes.LOAD_SETTINGS,
        payload: {
            serverIdentifier: settings.serverIdentifier,
            librarySection: settings.librarySection
        }
    };
}

export const setSettingServer = (identifier) => {
    SettingsUtils.saveSettingToStorage("settings_serverIdentifier", identifier);
    return {
        type: actionTypes.SAVE_SETTING_SERVER,
        payload: {
            serverIdentifier: identifier
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