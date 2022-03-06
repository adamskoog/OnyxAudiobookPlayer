export const SETTINGS_KEYS = {
    serverId: 'settings_serverIdentifier',
    libraryId: 'settings_library',
    token: 'authToken',
    loginRedirectId: 'login_redirect_id'
};

export const loadSettingsFromStorage = () => {
    let settings = {
        serverIdentifier: localStorage.getItem(SETTINGS_KEYS.serverId),
        librarySection: localStorage.getItem(SETTINGS_KEYS.libraryId)
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