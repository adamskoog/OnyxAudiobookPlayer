export const SETTINGS_KEYS = {
    serverId: 'settings_serverIdentifier',
    libraryId: 'settings_library',
    token: 'authToken',
    clientIdentifier: '',
    loginRedirectId: 'login_redirect_id',
    theme: 'dark_mode'
};
//navigator.appVersion
export const loadSettingsFromStorage = () => {
    let settings = {
        serverIdentifier: localStorage.getItem(SETTINGS_KEYS.serverId),
        clientIdentifier: localStorage.getItem(SETTINGS_KEYS.clientIdentifier),
        librarySection: localStorage.getItem(SETTINGS_KEYS.libraryId),
        isDarkMode: localStorage.getItem(SETTINGS_KEYS.theme)
    };

    return settings;
}

export const loadSettingFromStorage = (key) => {
    return localStorage.getItem(key);
}

export const saveSettingToStorage = (key, value) => {
    localStorage.setItem(key, value);    
}

export const removeSettingFromStorage = (key) => {
    localStorage.removeItem(key);
}