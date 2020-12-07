import PlexRequest from '../plex/PlexRequest';

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
            PlexRequest.getResources(authToken)
                .then(resources => {
    
                    // Filter for only media servers.
                    let servers = resources.filter((resource) => {
                        return resource.provides === "server";
                    });
                    // Add empty server for list
                    servers.unshift({ name: "", clientIdentifier: "" });

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

    static loadServerLibraries = (resource) => {
        return new Promise((resolve, reject) => {
   
            // TODO: use updated find connection code.
            let connection = null;
            for (let j = 0; j < resource.connections.length; j++) {
                if (resource.connections[j].local === false && resource.connections[j].relay === false) {
                    connection = resource.connections[j];
                    break;
                }
            }

            PlexRequest.getSections(connection.uri, resource.accessToken)
                .then(mediaContainer => {
                    const sections = mediaContainer.MediaContainer.Directory;

                    if (sections.length === 0)
                        resolve([]);
                    else {
                        const musicLibariries = sections.filter((section) => {
                            return section.type === "artist";
                        });
                        musicLibariries.unshift({ title: "", key: "" });
                        // set the resources to the state.
                        resolve(musicLibariries);
                    }
                });
        });
    }
}

export default SettingsUtils;