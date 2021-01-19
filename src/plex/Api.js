class PlexApi
{
    static baseParams = {
        "X-Plex-Product": "Audiobook Player for Plex",
        "X-Plex-Version": "0.9.1",
        "X-Plex-Client-Identifier": "616647cf-a68b-4474-8b4f-3ad72ed95cf9"
    };

    static getArgs = { 
        method: "GET", 
        mode: "cors", 
        headers: { 
            "Content-Type": "application/json", 
            "Accept": "application/json" 
        }
    };

    static postArgs = { 
        method: "POST", 
        mode: "cors", 
        headers: { 
            "Content-Type": "application/json", 
            "Accept": "application/json" 
        }
    };

    static formatUrl(url, args) {
        const params = require('qs').stringify(args);
        if (params && params !== "")
            return `${url}?${params}`;
        return url;
    }

    // https://forums.plex.tv/t/authenticating-with-plex/609370
    // We can also getting setting information - libraries
    // https://plex.tv/api/v2/user?includeSubscriptions=1&includeProviders=1&includeSettings=1&includeSharedSettings=1&X-Plex-Product=Plex%20Web&X-Plex-Version=4.48.1&X-Plex-Client-Identifier=0bkgja3athsl27xtz5mh7m49&X-Plex-Platform=Microsoft%20Edge&X-Plex-Platform-Version=87.0&X-Plex-Sync-Version=2&X-Plex-Features=external-media%2Cindirect-media&X-Plex-Model=hosted&X-Plex-Device=Windows&X-Plex-Device-Name=Microsoft%20Edge&X-Plex-Device-Screen-Resolution=1500x858%2C1500x1000&X-Plex-Language=en&X-Plex-Token=mnjYNhmCzSzYxmazHtoj
    // Get home users?
    // https://plex.tv/api/home/users?X-Plex-Product=Plex%20Web&X-Plex-Version=4.48.1&X-Plex-Client-Identifier=0bkgja3athsl27xtz5mh7m49&X-Plex-Platform=Microsoft%20Edge&X-Plex-Platform-Version=87.0&X-Plex-Sync-Version=2&X-Plex-Features=external-media%2Cindirect-media&X-Plex-Model=hosted&X-Plex-Device=Windows&X-Plex-Device-Name=Microsoft%20Edge&X-Plex-Device-Screen-Resolution=1500x858%2C1500x1000&X-Plex-Token=mnjYNhmCzSzYxmazHtoj&X-Plex-Language=en
    // https://plex.tv/api/users?X-Plex-Product=Plex%20Web&X-Plex-Version=4.48.1&X-Plex-Client-Identifier=0bkgja3athsl27xtz5mh7m49&X-Plex-Platform=Microsoft%20Edge&X-Plex-Platform-Version=87.0&X-Plex-Sync-Version=2&X-Plex-Features=external-media%2Cindirect-media&X-Plex-Model=hosted&X-Plex-Device=Windows&X-Plex-Device-Name=Microsoft%20Edge&X-Plex-Device-Screen-Resolution=1500x858%2C1500x1000&X-Plex-Token=mnjYNhmCzSzYxmazHtoj&X-Plex-Language=en
    static checkToken(token) {
        return new Promise((resolve, reject) => {

            const params = Object.assign({}, PlexApi.baseParams, { "X-Plex-Token" : token });
            const url = PlexApi.formatUrl(`https://plex.tv/api/v2/user`, params);
    
            fetch(url, PlexApi.getArgs)
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    if (data.errors) {
                        resolve({ message: data.errors[0].message });
                    }
                    resolve(data);
                });
        });
    }

    static signIn() {
        return new Promise((resolve, reject) => {
            const localParams = {
                strong: true
            }
            const params = Object.assign({}, PlexApi.baseParams, localParams);
            let url = PlexApi.formatUrl('https://plex.tv/api/v2/pins', params);

            fetch(url, PlexApi.postArgs)
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    // We have the pin information, now we construct the url
                    const authAppUrl = PlexApi.formatUrl(`https://app.plex.tv/auth#`, {
                        clientID: PlexApi.baseParams["X-Plex-Client-Identifier"],
                        code: data.code,
                        forwardUrl: window.location.href,
                        context: {
                            device: {
                                product: PlexApi.baseParams["X-Plex-Product"]
                            },
                        }
                    });

                    resolve({ id: data.id, redirectUrl: authAppUrl });
                });
        });
    }

    static validatePin(id) {
        return new Promise((resolve, reject) => {
            let url = `https://plex.tv/api/v2/pins/${id}?` +
            require('qs').stringify({
                "X-Plex-Client-Identifier": PlexApi.baseParams["X-Plex-Client-Identifier"],
            });
            console.log("validateurl", url);
            fetch(url, PlexApi.getArgs)
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    resolve(data);
                });
        });
    }

    static getResources(token) {
        const localParams = {
            includeHttps: 1,
            includeRelay: 1
        };
        const params = Object.assign({}, PlexApi.baseParams, localParams, { "X-Plex-Token": token });

        let url = PlexApi.formatUrl(`https://plex.tv/api/v2/resources`, params);

        return fetch(url, PlexApi.getArgs)
            .then((response) => {
                return response.json();
        });
    }

    static async fetchWithTimeout(resource, options) {
        const { timeout = 8000 } = options;
        
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);
      
        const response = await fetch(resource, {
          ...options,
          signal: controller.signal  
        });
        clearTimeout(id);
      
        return response;
    }

    static serverConnectionTest(connections, token) {
        return new Promise((resolve, reject) => {
            const localParams = {}
            const params = Object.assign({}, PlexApi.baseParams, localParams, { "X-Plex-Token": token });

            // TODO: There might be a better endpoint, but the payload on this is relatively small.
            //       The timeout length could also be a concern.
            const connectionPromises = connections.map((connection) => {
                return PlexApi.fetchWithTimeout(PlexApi.formatUrl(`${connection.uri}/library/sections`, params), {
                    timeout: 1000
                  });
            });

            Promise.allSettled(connectionPromises).then((values) => {
                let preferredConnection = null;
                for (let i = 0; i < connections.length; i++) {
                    for (let j = 0; j < values.length; j++) {
                        if (values[i].status === "fulfilled" && values[i].value.url.includes(connections[j].uri)) {
                            preferredConnection = connections[j].uri;
                            break;
                        }
                    }
                    if (preferredConnection) break;
                }
                
                if (preferredConnection)
                    resolve({ uri: preferredConnection });
                reject({ message: "Failed to resolve connection to server." });
            }).catch((error) => {
                reject({ message: "Failed to resolve connection to server." });
            });
        });
    }

    static getSections(baseUrl, token) {
        
        const localParams = {}
        const params = Object.assign({}, PlexApi.baseParams, localParams, { "X-Plex-Token": token });

        let url = PlexApi.formatUrl(`${baseUrl}/library/sections`, params);

        return fetch(url, PlexApi.getArgs)
            .then((response) => {
                return response.json();
        });
    }

    static getSectionHubs(baseUrl, section, token) {
        const localParams = {
            excludeFields: "summary"
        }
        const params = Object.assign({}, localParams, PlexApi.baseParams, { "X-Plex-Token": token });

        let url = PlexApi.formatUrl(`${baseUrl}/hubs/sections/${section}`, params);

        return fetch(url, PlexApi.getArgs)
            .then((response) => {
                return response.json();
        });
    }

    static getThumbnailUrl(baseUrl, thumb, args) {
        return PlexApi.formatUrl(`${baseUrl}${thumb}`, args);
    }

    static getThumbnailTranscodeUrl(h, w, baseUrl, thumb, token) {
        let params = {
            width: w,
            height: h,
            minSize: 1,
            upscale: 1,
            url: `${thumb}?X-Plex-Token=${token}`,
            "X-Plex-Token": token
        };

        return PlexApi.formatUrl(`${baseUrl}/photo/:/transcode`, params);
    }

    static getLibraryItems(baseUrl, section, args, sort) {

        const localParams = {
            type: 9,
            includeAdvanced: 1,
            includeMeta: 1,
            includeCollections: 1,
            includeExternalMedia: 1,
            sort: sort ?? "artist.titleSort,album.titleSort,album.index,album.id,album.originallyAvailableAt"
        };
        const params = Object.assign({}, PlexApi.baseParams, localParams, args);

        let url = PlexApi.formatUrl(`${baseUrl}/library/sections/${section}/all`, params);

        return fetch(url, PlexApi.getArgs)
            .then((response) => {
                return response.json();
        });
    }

    static getAlbumMetadata(baseUrl, itemId, args) {
        let url = `${baseUrl}/library/metadata/${itemId}/children`;

        const localParams = { };
        const params = Object.assign({}, PlexApi.baseParams, localParams, args);

        url = PlexApi.formatUrl(url, params);

        return fetch(url, PlexApi.getArgs)
            .then((response) => {
                return response.json();
        });
    }

    static scrobble(baseUrl, key, token) {
        const localParams = { 
            key: key,                                   // ratingKey
            "X-Plex-Token": token,
            identifier: "com.plexapp.plugins.library"
        };

        // Using unscrobble to not add to play count - scrobble endpoint takes same
        // params and does effectively the same thing however.
        const params = Object.assign({}, PlexApi.baseParams, localParams);
        let url = PlexApi.formatUrl(`${baseUrl}/:/scrobble`, params);

        return fetch(url, PlexApi.getArgs)
            .then((response) => {
                return response.json();
            }).catch((err) => {
                //console.log("swallow");
            });
    }

    static unscrobble(baseUrl, key, token) {
        const localParams = { 
            key: key,                                   // ratingKey
            "X-Plex-Token": token,
            identifier: "com.plexapp.plugins.library"
        };

        const params = Object.assign({}, PlexApi.baseParams, localParams);
        let url = PlexApi.formatUrl(`${baseUrl}/:/unscrobble`, params);

        return fetch(url, PlexApi.getArgs)
            .then((response) => {
                return response.json();
            }).catch((err) => {
                //console.log("swallow");
            });
    }

    static progress(baseUrl, args) {
        const localParams = { 
            identifier: "com.plexapp.plugins.library"
        };

        const params = Object.assign({}, PlexApi.baseParams, localParams, args);
        let url = PlexApi.formatUrl(`${baseUrl}/:/progress`, params);

        return fetch(url, PlexApi.getArgs)
            .then((response) => {
                return response.json();
            }).catch((err) => {
                //console.log("swallow");
            });
    }

    static updateTimeline(baseUrl, args) {
   
        const localParams = { 
            hasMDE: 0,
            "X-Plex-Text-Format": "plain"
        };

        const params = Object.assign({}, PlexApi.baseParams, localParams, args);
        let url = PlexApi.formatUrl(`${baseUrl}/:/timeline`, params);

        return fetch(url, PlexApi.getArgs)
            .then((response) => {
                return response.json();
            }).catch((err) => {
                //console.log("swallow");
            });
    }
}

export default PlexApi;