import { v4 as uuidv4 } from 'uuid';

export const SETTINGS_KEYS: {[key: string]: string} = {
    serverId: 'settings_serverIdentifier',
    libraryId: 'settings_library',
    token: 'authToken',
    clientIdentifier: 'clientIdentifier',
    loginRedirectId: 'login_redirect_id',
    skipForwardIncrement: 'skipForwardIncrement',
    skipBackwardIncrement: 'skipBackwardIncrement',
    storeLibraryScrollPosition: 'storeLibraryScrollPosition'
};

export const FEATURE_FLAG = {
    ON: "1",
    OFF: "0"
}

export type BrowserSettings = {
    serverIdentifier: string | null,
    clientIdentifier: string | null,
    librarySection: string | null
}
export type AuthSettings = {
    token: string | null,
    clientIdentifier: string,
    authId: string | null
}

const generateClientId = (): string => {
    // We need to auto generate a guid to pass to the server
    // when this value doesn't exist
    const clientIdentifier = uuidv4();

    console.log("save client id", clientIdentifier);
    saveSettingToStorage(SETTINGS_KEYS.clientIdentifier, clientIdentifier);
    return clientIdentifier;
};

export const loadAuthSettings = (): AuthSettings => {

    let savedClientId = localStorage.getItem(SETTINGS_KEYS.clientIdentifier);
    if (!savedClientId) {
        // If we don't have a client id - aren't logged in. Clear setings
        // to be sure and begin auth flow.
        clearSettings();

        return {
            token: null,
            authId: null,
            clientIdentifier: generateClientId()
        }
    }

    return {
        token: localStorage.getItem(SETTINGS_KEYS.token),
        clientIdentifier: savedClientId,
        authId: localStorage.getItem(SETTINGS_KEYS.loginRedirectId)
    }
}

// Get an object of all settings required for initial app load.
export const loadSettingsFromStorage = (): BrowserSettings => {
    const settings: BrowserSettings = {
        serverIdentifier: localStorage.getItem(SETTINGS_KEYS.serverId),
        clientIdentifier: localStorage.getItem(SETTINGS_KEYS.clientIdentifier),
        librarySection: localStorage.getItem(SETTINGS_KEYS.libraryId)
    };

    return settings;
};

export const loadSettingFromStorage = (key: string): string | null => localStorage.getItem(key);

export const saveSettingToStorage = (key: string, value: string): void => {
    localStorage.setItem(key, value);
};

export const removeSettingFromStorage = (key: string): void => {
    localStorage.removeItem(key);
};

export const clearSettings = (): void => {
    const keys = Object.keys(SETTINGS_KEYS);
    keys.forEach((key) => {
        if (key !== SETTINGS_KEYS.clientIdentifier && key !== SETTINGS_KEYS.loginRedirectId) {
            removeSettingFromStorage(SETTINGS_KEYS[key]);
        }
    });
};
