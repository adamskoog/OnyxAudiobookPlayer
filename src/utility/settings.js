import PlexApi from '../plex/Api';

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

    static saveSettingToStorage(key, value) {
        localStorage.setItem(key, value);    
    }

    static loadServers = (authToken) => {
        return new Promise((resolve, reject) => {
            PlexApi.getResources(authToken)
                .then(resources => {
    
                    // Filter for only media servers.
                    let servers = resources.filter((resource) => {
                        return resource.provides === "server";
                    });

                    if (servers.length === 0)
                        reject({ message: "No servers were found."});
                    else
                        resolve(servers);
                }).catch((error) => {
                    reject({ message: "Unhandled error", error: error });
                });
            });
    }

    static findResourceMatch = (serverIdentifier, resources) => {
        for (let i = 0; i < resources.length; i++) {
            if (serverIdentifier === resources[i].clientIdentifier) {
                return resources[i];
            }
        }

        return null;
    }

    static loadServerLibraries = (url, token) => {
        return new Promise((resolve, reject) => {
            PlexApi.getSections(url, token)
                .then(mediaContainer => {
                    const sections = mediaContainer.MediaContainer.Directory;

                    if (sections.length === 0)
                        resolve([]);
                    else {
                        const musicLibariries = sections.filter((section) => {
                            return section.type === "artist";
                        });

                        resolve(musicLibariries);
                    }
                });
        });
    }

    static findServerBaseUrl = (resource) => {
        return new Promise((resolve, reject) => {
            PlexApi.serverConnectionTest(resource.connections, resource.accessToken)
                .then((response) => {
                    resolve({ url: response.uri });
                }).catch((error) => {
                    reject({ message: "Failed to determine base url.", error: error });
                });
        });
    };
}

export default SettingsUtils;