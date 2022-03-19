
const PLEX_BASE_URL = 'https://plex.tv';
const PLEX_RESOURCES_URL = '/api/v2/resources';
const PLEX_USER_URL = '/api/v2/user';
const PLEX_PINS_URL = '/api/v2/pins';

const BASE_PARAMS: any = {
    "X-Plex-Device-Name": "Onyx",
    "X-Plex-Product": "Onyx Audiobook Player",
    "X-Plex-Version": "0.9.1",
    "X-Plex-Client-Identifier": "616647cf-a68b-4474-8b4f-3ad72ed95cf9",
    "X-Plex-Platform": "Chrome",  // fill in with found browser....
    "X-Plex-Device": "Windows",
};

const BASE_REQUEST: any = {
    mode: "cors", 
    headers: { 
        "Content-Type": "application/json", 
        "Accept": "application/json" 
    }
}
const GET_REQUEST: any = { method: "GET", ...BASE_REQUEST };
const POST_REQUEST: any = { method: "POST", ...BASE_REQUEST };

export const formatUrl = (url: string, args: any) => {
    const params = require('qs').stringify(args);
    if (params && params !== "")
        return `${url}?${params}`;
    return url;
}

export const RESOURCETYPES = {
    server: "server"
};

export const LIBRARYTYPES = {
    music: 'artist'
};

export const getResources = async (token: string, resourceType?: any): Promise<any> => {
    const localParams = {
        includeHttps: 1,
        includeRelay: 1
    };
    const params = { ...BASE_PARAMS, ...localParams, 'X-Plex-Token': token };
    const url = formatUrl(`${PLEX_BASE_URL}${PLEX_RESOURCES_URL}`, params);

    const response = await fetch(url, GET_REQUEST);
    if (!response.ok) return [];    // If request fails, return empty array. TODO: something better??

    const resources = await response.json();
    if (!resourceType) return resources;    // return the unfilters resource reponse.

    return resources.filter((resource) => {
        return resource.provides === resourceType;
    });
}

export const findServerBaseUrl = async (resource: any): Promise<any> => {
    // TODO: refactor server connection test.
    const url = await serverConnectionTest(resource.connections, resource.accessToken);
    return url;
};

export const getLibraries = async (url: string, token: string): Promise<any> => {
    const mediaContainer = await getSections(url, token);   
    const sections = mediaContainer.MediaContainer.Directory;

    if (sections.length === 0)
        return [];
    return sections.filter((section: any) => {
        return section.type === LIBRARYTYPES.music;
    });
}

// https://forums.plex.tv/t/authenticating-with-plex/609370
// We can also getting setting information - libraries
// https://plex.tv/api/v2/user?includeSubscriptions=1&includeProviders=1&includeSettings=1&includeSharedSettings=1&X-Plex-Product=Plex%20Web&X-Plex-Version=4.48.1&X-Plex-Client-Identifier=0bkgja3athsl27xtz5mh7m49&X-Plex-Platform=Microsoft%20Edge&X-Plex-Platform-Version=87.0&X-Plex-Sync-Version=2&X-Plex-Features=external-media%2Cindirect-media&X-Plex-Model=hosted&X-Plex-Device=Windows&X-Plex-Device-Name=Microsoft%20Edge&X-Plex-Device-Screen-Resolution=1500x858%2C1500x1000&X-Plex-Language=en&X-Plex-Token=mnjYNhmCzSzYxmazHtoj
// Get home users?
// https://plex.tv/api/home/users?X-Plex-Product=Plex%20Web&X-Plex-Version=4.48.1&X-Plex-Client-Identifier=0bkgja3athsl27xtz5mh7m49&X-Plex-Platform=Microsoft%20Edge&X-Plex-Platform-Version=87.0&X-Plex-Sync-Version=2&X-Plex-Features=external-media%2Cindirect-media&X-Plex-Model=hosted&X-Plex-Device=Windows&X-Plex-Device-Name=Microsoft%20Edge&X-Plex-Device-Screen-Resolution=1500x858%2C1500x1000&X-Plex-Token=mnjYNhmCzSzYxmazHtoj&X-Plex-Language=en
// https://plex.tv/api/users?X-Plex-Product=Plex%20Web&X-Plex-Version=4.48.1&X-Plex-Client-Identifier=0bkgja3athsl27xtz5mh7m49&X-Plex-Platform=Microsoft%20Edge&X-Plex-Platform-Version=87.0&X-Plex-Sync-Version=2&X-Plex-Features=external-media%2Cindirect-media&X-Plex-Model=hosted&X-Plex-Device=Windows&X-Plex-Device-Name=Microsoft%20Edge&X-Plex-Device-Screen-Resolution=1500x858%2C1500x1000&X-Plex-Token=mnjYNhmCzSzYxmazHtoj&X-Plex-Language=en
export const checkToken = async (token: string): Promise<any> => {

    const params = { ...BASE_PARAMS, 'X-Plex-Token': token };
    const url = formatUrl(`${PLEX_BASE_URL}${PLEX_USER_URL}`, params);

    const response = await fetch(url, GET_REQUEST);
    //if (!response.ok) return [];    // If request fails, return empty array. TODO: something better??

    const data = await response.json();
    if (data.errors) {
        return { message: data.errors[0].message };
    }
    return data;
}

export const signIn = async (): Promise<any> => {
    const localParams = {
        strong: true
    }
    const params = { ...BASE_PARAMS, ...localParams };
    const url = formatUrl(`${PLEX_BASE_URL}${PLEX_PINS_URL}`, params);

    const response = await fetch(url, POST_REQUEST);
    const data = await response.json();

    const authAppUrl = formatUrl(`https://app.plex.tv/auth#`, {
        clientID: BASE_PARAMS["X-Plex-Client-Identifier"],
        code: data.code,
        forwardUrl: window.location.href,
        context: {
            device: {
                product: BASE_PARAMS["X-Plex-Product"]
            },
        }
    });

    return { id: data.id, redirectUrl: authAppUrl };
}

export const validatePin = async (id: string): Promise<any> => {
    const url = `https://plex.tv/api/v2/pins/${id}?` +
    require('qs').stringify({
        "X-Plex-Client-Identifier": BASE_PARAMS["X-Plex-Client-Identifier"],
    });
    const response = await fetch(url, GET_REQUEST);
    const data = await response.json();
    return data;
}

const fetchWithTimeout = async (resource: any, options: any): Promise<any> => {
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

/**
 * Run connection tests for a server to determine the best connection to use.
 * @param {array[uri]} connections - An array of the server connections to be tested.
 * @param {string} token 
 */
export const serverConnectionTest = (connections: any, token: string): Promise<any> => {

    return new Promise((resolve, reject) => {

        const params = { ...BASE_PARAMS, 'X-Plex-Token': token };

        const connectionPromises = connections.map((connection) => {
            // Use different timeout lengths for local vs remote servers.
            const timeout = (connection.local) ? 1000 : 5000;

            // Identity endpoint is very small, used by other projects.
            return fetchWithTimeout(formatUrl(`${connection.uri}/identity`, params), {
                timeout: timeout
            });
        });

        Promise.allSettled(connectionPromises).then((values: any) => {
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

export const getSections = async (baseUrl: string, token: string): Promise<any> => {
        
    const params = { ...BASE_PARAMS, 'X-Plex-Token': token };
    const url = formatUrl(`${baseUrl}/library/sections`, params);

    const response = await fetch(url, GET_REQUEST);
    const data = await response.json();
    return data;
}

export const getSectionHubs = async (baseUrl: string, section: string, token: string): Promise<any> => {
    const localParams = {
        excludeFields: "summary"
    }
    const params = { ...BASE_PARAMS, ...localParams, 'X-Plex-Token': token };
    const url = formatUrl(`${baseUrl}/hubs/sections/${section}`, params);

    const response = await fetch(url, GET_REQUEST);
    const data = await response.json();
    return data;
}

export const getThumbnailUrl = (baseUrl: string, thumb: string, args: any): string => {
    return formatUrl(`${baseUrl}${thumb}`, args);
}

export const getThumbnailTranscodeUrl = (h: number, w: number, baseUrl: string, thumb: string, token: string): string => {
    let params = {
        width: w,
        height: h,
        minSize: 1,
        upscale: 1,
        url: `${thumb}?X-Plex-Token=${token}`,
        "X-Plex-Token": token
    };

    return formatUrl(`${baseUrl}/photo/:/transcode`, params);
}

export const MUSIC_LIBRARY_DISPAY_TYPE = {
    artist: { title: 'Author', key: 8 },
    album: { title: 'Book', key: 9 }
};

export const SORT_ORDER = {
    ascending: 'Ascending',
    descending: 'Decending'
}

// TODO: this whole thing needs to be cleaned up and refactored. It's really rough.
export const createLibrarySortQuery = ({ order, display } ): any => {
    let args: any = {};

    // Set the default value for display
    if (!display)
        args.type = MUSIC_LIBRARY_DISPAY_TYPE.album.key;
    else {
        if (display === MUSIC_LIBRARY_DISPAY_TYPE.album.title)
            args.type = MUSIC_LIBRARY_DISPAY_TYPE.album.key
        else
            args.type = MUSIC_LIBRARY_DISPAY_TYPE.artist.key
    }

    if (!order)
        // set a default order based on the album type.
        if (args.type === MUSIC_LIBRARY_DISPAY_TYPE.album.key)
            args.order = 'artist.titleSort,album.titleSort,album.index,album.id,album.originallyAvailableAt';
        else
            args.order = 'titleSort';
    else {
        let desc = '';
        if (order === SORT_ORDER.descending)
            desc = ':desc';
        if (args.type === MUSIC_LIBRARY_DISPAY_TYPE.album.key)
            args.order = `artist.titleSort${desc},album.titleSort,album.index,album.id,album.originallyAvailableAt`;
        else
            args.order = `titleSort${desc}`;
    }

    return args;
};

export const getLibraryItems = async (baseUrl: string, section: string, args: any, sortArgs?: any): Promise<any> => {

    if (!sortArgs) {
        sortArgs = createLibrarySortQuery({ order: null, display: null });
    }

    const localParams = {
        type: sortArgs.type,
        includeAdvanced: 1,
        includeMeta: 1,
        includeCollections: 1,
        includeExternalMedia: 1,
        sort: sortArgs.order
    };
    const params = { ...BASE_PARAMS, ...localParams, ...args };
    const url = formatUrl(`${baseUrl}/library/sections/${section}/all`, params);

    const response = await fetch(url, GET_REQUEST);
    const data = await response.json();
    return data;
}

export const getAlbumMetadata = async (baseUrl: string, itemId: string, args: any): Promise<ArtistMediaContainer> => {
    const localParams = { };
    const params = { ...BASE_PARAMS, ...localParams, ...args };
    const url = formatUrl(`${baseUrl}/library/metadata/${itemId}/children`, params);

    const response = await fetch(url, GET_REQUEST);
    const data = await response.json();
    return data;
}

export const scrobble = async (baseUrl: string, key: string, token: string): Promise<void> => {
    const localParams = { 
        key: key,                                   // ratingKey
        "X-Plex-Token": token,
        identifier: "com.plexapp.plugins.library"
    };

    // Using unscrobble to not add to play count - scrobble endpoint takes same
    // params and does effectively the same thing however.
    const params = { ...BASE_PARAMS, ...localParams };
    const url = formatUrl(`${baseUrl}/:/scrobble`, params);
    //const response = 
    await fetch(url, GET_REQUEST);
    //const data = await response.json();

    // we don't need to do anything, need to handle error.
}

export const unscrobble = async (baseUrl: string, key: string, token: string): Promise<void> => {
    const localParams = { 
        key: key,                                   // ratingKey
        "X-Plex-Token": token,
        identifier: "com.plexapp.plugins.library"
    };

    const params = { ...BASE_PARAMS, ...localParams };
    const url = formatUrl(`${baseUrl}/:/unscrobble`, params);

    //const response = 
    await fetch(url, GET_REQUEST);
    //const data = await response.json();

    // we don't need to do anything, need to handle error.
}

export const progress = async (baseUrl: string, args: any): Promise<any> => {
    const localParams = { 
        identifier: "com.plexapp.plugins.library"
    };

    const params = { ...BASE_PARAMS, ...localParams, ...args };
    const url = formatUrl(`${baseUrl}/:/progress`, params);

    const response = await fetch(url, GET_REQUEST);
    const data = await response.json();
    return data;
}

export const updateTimeline = async (baseUrl: string, args: any): Promise<any> => {
   
    const localParams = { 
        hasMDE: 0,
        "X-Plex-Text-Format": "plain"
    };

    const params = { ...BASE_PARAMS, ...localParams, ...args };
    const url = formatUrl(`${baseUrl}/:/timeline`, params);

    const response = await fetch(url, GET_REQUEST);
    const data = await response.json();
    return data;
}



export declare type ArtistMediaContainer = {
    MediaContainer: ArtistMetadata
}
export declare type AlbumMediaContainer = {
    MediaContainer: AlbumMetadata
}

// Artist?? Is this the same as others???
export declare type ArtistMetadata = {
    Metadata: Array<AlbumMetadata>,
    allowSync: boolean,
    art: string,
    key: string,
    librarySectionID: number,
    librarySectionTitle: string,
    librarySectionUUID: string,
    mediaTagPrefix: string,
    mediaTagVersion: number,
    nocache: boolean,
    parentIndex: number,
    parentTitle: string,
    size: number,
    summary: string,
    thumb: string,
    title1: string,
    title2: string,
    viewGroup: string,
    viewMode: number
};

/// This comes from under Artist, same as media container on album view??
export declare type AlbumMetadata = {
    addedAt: number,
    guid: string,
    index: number,
    key: string,
    lastViewedAt: number,
    loudnessAnalysisVersion: string,
    originallyAvailableAt: string,
    parentGuid: string,
    parentRatingKey: string,
    parentThumb: string,
    parentTitle: string,
    ratingKey: string,
    skipCount: number,
    studio: string,
    summary: string,
    thumb: string,
    title: string,
    titleSort: string,
    type: string,
    updatedAt: number,
    viewCount: number,
    year: number,
    Collection: Array<Tag>
};

export declare type Tag = {
    tag: string
}