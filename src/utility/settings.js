export const SETTINGS_KEYS = {
    serverId: 'settings_serverIdentifier',
    libraryId: 'settings_library'
};

export const loadSettingsFromStorage = () => {
    let settings = {
        serverIdentifier: localStorage.getItem(SETTINGS_KEYS.serverId),
        librarySection: localStorage.getItem(SETTINGS_KEYS.libraryId)
    };

    return settings;
}

export const saveSettingToStorage = (key, value) => {
    localStorage.setItem(key, value);    
}