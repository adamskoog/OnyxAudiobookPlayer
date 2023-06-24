export const SETTINGS_KEYS: {[key: string]: string} = {
  serverId: 'settings_serverIdentifier',
  libraryId: 'settings_library',
  token: 'authToken',
  clientIdentifier: 'clientIdentifier',
  loginRedirectId: 'login_redirect_id'
};

export type BrowserSettings = {
    serverIdentifier: string | null,
    clientIdentifier: string | null,
    librarySection: string | null
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
        removeSettingFromStorage(SETTINGS_KEYS[key]);
    });
};
