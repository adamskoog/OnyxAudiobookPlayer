class SettingsUtils
{
    static loadSettingsFromStorage() {
        let settings = {
            serverIdentifier: localStorage.getItem("settings_serverIdentifier"),
            librarySection: localStorage.getItem("settings_library")
        };

        return settings;
    }

    static saveSettingsToStorage(settings) {
        localStorage.setItem("settings_serverIdentifier", settings.serverIdentifier);
        localStorage.setItem("settings_library", settings.librarySection);        
    }
}

export default SettingsUtils;