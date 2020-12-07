class PlexRequest
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

            const params = Object.assign({}, PlexRequest.baseParams, { "X-Plex-Token" : token });
            const url = PlexRequest.formatUrl(`https://plex.tv/api/v2/user`, params);
    
            fetch(url, PlexRequest.getArgs)
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
            const params = Object.assign({}, PlexRequest.baseParams, localParams);
            let url = PlexRequest.formatUrl('https://plex.tv/api/v2/pins', params);

            fetch(url, PlexRequest.postArgs)
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    // We have the pin information, now we construct the url
                    const authAppUrl = PlexRequest.formatUrl(`https://app.plex.tv/auth#`, {
                        clientID: PlexRequest.baseParams["X-Plex-Client-Identifier"],
                        code: data.code,
                        forwardUrl: window.location.href,
                        context: {
                            device: {
                                product: PlexRequest.baseParams["X-Plex-Product"]
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
                "X-Plex-Client-Identifier": PlexRequest.baseParams["X-Plex-Client-Identifier"],
            });
    
            fetch(url, PlexRequest.getArgs)
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
        const params = Object.assign({}, PlexRequest.baseParams, localParams, { "X-Plex-Token": token });

        let url = PlexRequest.formatUrl(`https://plex.tv/api/v2/resources`, params);

        return fetch(url, PlexRequest.getArgs)
            .then((response) => {
                return response.json();
        });
    }

    static serverConnectionTest(connections, token) {
        return new Promise((resolve, reject) => {
            const localParams = {}
            const params = Object.assign({}, PlexRequest.baseParams, localParams, { "X-Plex-Token": token });

            // TODO: There might be a better endpoint, but the payload on this is relatively small.
            const connectionPromises =connections.map((connection) => {
                return PlexRequest.formatUrl(`${connection.uri}/library/sections`, params);
            });

            // TODO: This bit is fundementally flawed. The promises always seem to
            // return as fulfilled - whether the connection is accesible or not.
            Promise.allSettled(connectionPromises).then((values) => {
                let preferredConnection = null;
                for (let i = 0; i < connections.length; i++) {
                    for (let j = 0; j < values.length; j++) {
                        if (values[i].status === "fulfilled" && values[i].value.includes(connections[j].uri)) {
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
        const params = Object.assign({}, PlexRequest.baseParams, localParams, { "X-Plex-Token": token });

        let url = PlexRequest.formatUrl(`${baseUrl}/library/sections`, params);

        return fetch(url, PlexRequest.getArgs)
            .then((response) => {
                return response.json();
        });
    }

    static getThumbnailUrl(baseUrl, thumb, args) {
        return PlexRequest.formatUrl(`${baseUrl}${thumb}`, args);
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

        return PlexRequest.formatUrl(`${baseUrl}/photo/:/transcode`, params);
    }

    static getLibraryItems(baseUrl, section, args) {

        const localParams = {
            type: 9,
            includeAdvanced: 1,
            includeMeta: 1,
            includeCollections: 1,
            includeExternalMedia: 1,
            sort: "artist.titleSort,album.titleSort,album.index,album.id,album.originallyAvailableAt"
        };
        const params = Object.assign({}, PlexRequest.baseParams, localParams, args);

        let url = PlexRequest.formatUrl(`${baseUrl}/library/sections/${section}/all`, params);

        return fetch(url, PlexRequest.getArgs)
            .then((response) => {
                return response.json();
        });
    }

    static getAlbumMetadata(baseUrl, itemId, args) {
        let url = `${baseUrl}/library/metadata/${itemId}/children`;

        const localParams = { };
        const params = Object.assign({}, PlexRequest.baseParams, localParams, args);

        url = PlexRequest.formatUrl(url, params);

        return fetch(url, PlexRequest.getArgs)
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
        const params = Object.assign({}, PlexRequest.baseParams, localParams);
        let url = PlexRequest.formatUrl(`${baseUrl}/:/scrobble`, params);

        return fetch(url, PlexRequest.getArgs)
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

        const params = Object.assign({}, PlexRequest.baseParams, localParams);
        let url = PlexRequest.formatUrl(`${baseUrl}/:/unscrobble`, params);

        return fetch(url, PlexRequest.getArgs)
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

        const params = Object.assign({}, PlexRequest.baseParams, localParams, args);
        let url = PlexRequest.formatUrl(`${baseUrl}/:/progress`, params);

        return fetch(url, PlexRequest.getArgs)
            .then((response) => {
                return response.json();
            }).catch((err) => {
                //console.log("swallow");
            });
    }

    static updateTimeline(baseUrl, args) {

        // TODO: Need to better understand the play queue, we will want to 
        //       queue up the remaining tracks in the books to continue playing.
        // - playQueueItemID=719012     ? how do we get this? is it needed?
        // - state=paused       playing? stopped?
        // - X-Plex-Session-Identifier=8lq3f8kkqi58si6u1d0waehf
    
        const localParams = { 
            hasMDE: 0,
            "X-Plex-Text-Format": "plain"
        };

        const params = Object.assign({}, PlexRequest.baseParams, localParams, args);
        let url = PlexRequest.formatUrl(`${baseUrl}/:/timeline`, params);

        return fetch(url, PlexRequest.getArgs)
            .then((response) => {
                return response.json();
            }).catch((err) => {
                //console.log("swallow");
            });
    }
}

export default PlexRequest;