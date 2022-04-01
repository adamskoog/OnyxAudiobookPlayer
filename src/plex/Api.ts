import axios, { AxiosInstance } from 'axios';
import qs from 'qs';


export const RESOURCETYPES = {
  server: 'server',
};

export const LIBRARYTYPES = {
  music: 'artist',
};

// Placeholder types
type UserInfo = any;
type Resource = any;

export const formatUrl = (url: string, args: any): string => {
  const params = qs.stringify(args);
  if (params && params !== '') return `${url}?${params}`;
  return url;
};

export class PlexTvApi {

    private static client: AxiosInstance;

    private static PLEX_BASE_URL: string = 'https://plex.tv';
    private static PLEX_RESOURCES_URL: string = '/api/v2/resources';
    private static PLEX_USER_URL = '/api/v2/user';
    private static PLEX_PINS_URL = '/api/v2/pins';

    private static isInitialized: boolean = false;
    private static requestTokenParam: Object = {
      'X-Plex-Token': null
    };
    private static requestBaseParams: Object = {
        'X-Plex-Device-Name': 'Onyx',
        'X-Plex-Product': 'Onyx Audiobook Player',
        'X-Plex-Version': '0.9.1',
        'X-Plex-Client-Identifier': null,
        'X-Plex-Platform': 'Chrome', // fill in with found browser....
        'X-Plex-Device': 'Windows'
    };

    get baseParams() {
        return PlexTvApi.requestBaseParams;
    }

    private static setupBaseParams(): void {
        // We need to auto generate a guid to pass to the server
        // when this value doesn't exist
        this.requestBaseParams['X-Plex-Client-Identifier'] = '616647cf-a68b-4474-8b4f-3ad72ed95cf9';
    };

    static initialize(clientIdentifier?: string): void {

        if (this.isInitialized) return;

        // We we don't have a client identifier set, we'll need to
        // authenticate - we will not have a token either.
        if (!clientIdentifier) this.setupBaseParams();

        // Create a client for plex.tv requests
        this.client = axios.create({
            baseURL: this.PLEX_BASE_URL,
            headers: {
              'Accept': 'application/json',
              'Content-type': 'application/json'
            }
        });

        this.isInitialized = true;
    };

    // https://forums.plex.tv/t/authenticating-with-plex/609370
    // We can also getting setting information - libraries
    // https://plex.tv/api/v2/user?includeSubscriptions=1&includeProviders=1&includeSettings=1&includeSharedSettings=1&X-Plex-Product=Plex%20Web&X-Plex-Version=4.48.1&X-Plex-Client-Identifier=0bkgja3athsl27xtz5mh7m49&X-Plex-Platform=Microsoft%20Edge&X-Plex-Platform-Version=87.0&X-Plex-Sync-Version=2&X-Plex-Features=external-media%2Cindirect-media&X-Plex-Model=hosted&X-Plex-Device=Windows&X-Plex-Device-Name=Microsoft%20Edge&X-Plex-Device-Screen-Resolution=1500x858%2C1500x1000&X-Plex-Language=en&X-Plex-Token=mnjYNhmCzSzYxmazHtoj
    // Get home users?
    // https://plex.tv/api/home/users?X-Plex-Product=Plex%20Web&X-Plex-Version=4.48.1&X-Plex-Client-Identifier=0bkgja3athsl27xtz5mh7m49&X-Plex-Platform=Microsoft%20Edge&X-Plex-Platform-Version=87.0&X-Plex-Sync-Version=2&X-Plex-Features=external-media%2Cindirect-media&X-Plex-Model=hosted&X-Plex-Device=Windows&X-Plex-Device-Name=Microsoft%20Edge&X-Plex-Device-Screen-Resolution=1500x858%2C1500x1000&X-Plex-Token=mnjYNhmCzSzYxmazHtoj&X-Plex-Language=en
    // https://plex.tv/api/users?X-Plex-Product=Plex%20Web&X-Plex-Version=4.48.1&X-Plex-Client-Identifier=0bkgja3athsl27xtz5mh7m49&X-Plex-Platform=Microsoft%20Edge&X-Plex-Platform-Version=87.0&X-Plex-Sync-Version=2&X-Plex-Features=external-media%2Cindirect-media&X-Plex-Model=hosted&X-Plex-Device=Windows&X-Plex-Device-Name=Microsoft%20Edge&X-Plex-Device-Screen-Resolution=1500x858%2C1500x1000&X-Plex-Token=mnjYNhmCzSzYxmazHtoj&X-Plex-Language=en

    /**
     * Check the auth token to make sure it is still valid for use.
     * @param token string - the auth token to validate.
     * @returns Promise<UserInfo> - a promise for the plex.tv user information.
     */
    static validateToken = async (token: string): Promise<UserInfo> => {
      
        // Update our currently stored token with the value passed.
        // this.plexToken = token;
        this.requestTokenParam['X-Plex-Token'] = token;

        try {
          const response = await this.client.get(this.PLEX_USER_URL, {
            params: {
                ...this.requestBaseParams,
                ...this.requestTokenParam
            }
          });
          const data = response.data;
          if (data.errors) {
            return { message: data.errors[0].message };
          }
          // Return the user information
          return data as UserInfo;
        } catch {
          this.requestTokenParam['X-Plex-Token'] = null;
          return { message: 'Unexpected error occurred.' };
        }
    };

    /**
     * Do user sign in request
     * @returns Promise<any> - TODO
     */
    static signIn = async (): Promise<any> => {
        const response = await this.client.post(this.PLEX_PINS_URL, {
          data: {
              strong: true,
              ...this.requestBaseParams,
              ...this.requestTokenParam
          }
        });

        // TODO: where should formatUrl live?
        const data = response.data;
        const authAppUrl = formatUrl(`${this.PLEX_BASE_URL}/auth#`, {
            clientID: BASE_PARAMS['X-Plex-Client-Identifier'],
            code: data.code,
            forwardUrl: window.location.href,
            context: {
                device: {
                    product: BASE_PARAMS['X-Plex-Product'],
                },
            },
        });
    
        return { id: data.id, redirectUrl: authAppUrl };
    };

    /**
     * Get the resources based on the authenticated user.
     * @param id string - the auth id obtained from plex.tv
     * @returns Promise<any> - TODO
     */
    static validatePin = async (id: string): Promise<any> => {
      const url = `${this.PLEX_BASE_URL}${this.PLEX_PINS_URL}/${id}?${qs.stringify({ 'X-Plex-Client-Identifier': BASE_PARAMS['X-Plex-Client-Identifier'] })}`;
      const response = await axios.get(url);
      return response.data;
    };

    /**
     * Get the resources based on the authenticated user.
     * @param resourceType string - a specific resource to be retrieved.
     * @returns Array<Resource> - an array of the resources that match the request.
     */
    static getResources = async (resourceType?: string): Promise<Array<Resource>> => {
        const response = await this.client.get(this.PLEX_RESOURCES_URL, {
            params: {
                includeHttps: 1,
                includeRelay: 1,
                ...this.requestBaseParams,
                ...this.requestTokenParam
            }
        });
        const resources: Array<Resource> = response.data;
        if (!resourceType) return resources; // return the unfilters resource reponse.   
        return resources.filter((resource: Resource) => resource.provides === resourceType);
    };
};

export class PlexServerApi {
    // private static plexToken: string | null = null;
    // private static clientIdentifier: string | null = null;
    // private static requestBaseParams: Object = {
    //   'X-Plex-Device-Name': 'Onyx',
    //   'X-Plex-Product': 'Onyx Audiobook Player',
    //   'X-Plex-Version': '0.9.1',
    //   'X-Plex-Client-Identifier': null,
    //   'X-Plex-Platform': 'Chrome', // fill in with found browser....
    //   'X-Plex-Device': 'Windows',
    //   'X-Plex-Token': null
    // };

    private static client: AxiosInstance;
    
    static initialize = async (resource: any): Promise<void> => {

        // This class is initialized by a server being selected.
        // This can happen on load or from the Settings page.
        const baseUrl = await this.determineBaseUrl(resource);

        this.client = axios.create({
          baseURL: baseUrl,
          headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json'
          }
        });

    };

    private static determineBaseUrl = async (resource: any): Promise<string> => {
        // TODO: refactor server connection test.
        const url = await this.serverConnectionTest(resource.connections, resource.accessToken);
        return url;
    };

    /**
     * Run connection tests for a server to determine the best connection to use.
     * @param {array[uri]} connections - An array of the server connections to be tested.
     * @param {string} token
     */
    private static serverConnectionTest = (connections: any, token: string): Promise<any> => new Promise((resolve, reject) => {
      const params = { ...BASE_PARAMS, 'X-Plex-Token': token };

      const connectionPromises = connections.map((connection) => {
        // Use different timeout lengths for local vs remote servers.
        const timeout = (connection.local) ? 1000 : 5000;

        // Identity endpoint is very small, used by other projects.
        return fetchWithTimeout(formatUrl(`${connection.uri}/identity`, params), {
          timeout,
        });
      });

      Promise.allSettled(connectionPromises).then((values: any) => {
        let preferredConnection = null;
        for (let i = 0; i < connections.length; i++) {
          for (let j = 0; j < values.length; j++) {
            if (values[i].status === 'fulfilled' && values[i].value.url.includes(connections[j].uri)) {
              preferredConnection = connections[j].uri;
              break;
            }
          }
          if (preferredConnection) break;
        }

        if (preferredConnection) resolve({ uri: preferredConnection });
        reject({ message: 'Failed to resolve connection to server.', error: 'No server connection found.' });
      }).catch((error) => {
        reject({ message: 'Failed to resolve connection to server.', error });
      });
    });
};




/// ****************   Old API   *********************
const BASE_PARAMS: any = {
  'X-Plex-Device-Name': 'Onyx',
  'X-Plex-Product': 'Onyx Audiobook Player',
  'X-Plex-Version': '0.9.1',
  'X-Plex-Client-Identifier': '616647cf-a68b-4474-8b4f-3ad72ed95cf9',
  'X-Plex-Platform': 'Chrome', // fill in with found browser....
  'X-Plex-Device': 'Windows',
};

const BASE_REQUEST: any = {
  mode: 'cors',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
};
const GET_REQUEST: any = { method: 'GET', ...BASE_REQUEST };
//const POST_REQUEST: any = { method: 'POST', ...BASE_REQUEST };

const fetchWithTimeout = async (resource: any, options: any): Promise<any> => {
  const { timeout = 8000 } = options;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  const response = await fetch(resource, {
    ...options,
    signal: controller.signal,
  });
  clearTimeout(id);

  return response;
};

/**
 * Run connection tests for a server to determine the best connection to use.
 * @param {array[uri]} connections - An array of the server connections to be tested.
 * @param {string} token
 */
export const serverConnectionTest = (connections: any, token: string): Promise<any> => new Promise((resolve, reject) => {
  const params = { ...BASE_PARAMS, 'X-Plex-Token': token };

  const connectionPromises = connections.map((connection) => {
    // Use different timeout lengths for local vs remote servers.
    const timeout = (connection.local) ? 1000 : 5000;

    // Identity endpoint is very small, used by other projects.
    return fetchWithTimeout(formatUrl(`${connection.uri}/identity`, params), {
      timeout,
    });
  });

  Promise.allSettled(connectionPromises).then((values: any) => {
    let preferredConnection = null;
    for (let i = 0; i < connections.length; i++) {
      for (let j = 0; j < values.length; j++) {
        if (values[i].status === 'fulfilled' && values[i].value.url.includes(connections[j].uri)) {
          preferredConnection = connections[j].uri;
          break;
        }
      }
      if (preferredConnection) break;
    }

    if (preferredConnection) resolve({ uri: preferredConnection });
    reject({ message: 'Failed to resolve connection to server.', error: 'No server connection found.' });
  }).catch((error) => {
    reject({ message: 'Failed to resolve connection to server.', error });
  });
});

export const findServerBaseUrl = async (resource: any): Promise<any> => {
  // TODO: refactor server connection test.
  const url = await serverConnectionTest(resource.connections, resource.accessToken);
  return url;
};

export const getSections = async (baseUrl: string, token: string): Promise<any> => {
  const params = { ...BASE_PARAMS, 'X-Plex-Token': token };
  const url = formatUrl(`${baseUrl}/library/sections`, params);

  const response = await fetch(url, GET_REQUEST);
  const data = await response.json();
  return data;
};

export const getLibraries = async (url: string, token: string): Promise<any> => {
  const mediaContainer = await getSections(url, token);
  const sections = mediaContainer.MediaContainer.Directory;

  if (sections.length === 0) return [];
  return sections.filter((section: any) => section.type === LIBRARYTYPES.music);
};

export const getSectionHubs = async (baseUrl: string, section: string, token: string): Promise<any> => {
  const localParams = {
    excludeFields: 'summary',
  };
  const params = { ...BASE_PARAMS, ...localParams, 'X-Plex-Token': token };
  const url = formatUrl(`${baseUrl}/hubs/sections/${section}`, params);

  const response = await fetch(url, GET_REQUEST);
  const data = await response.json();
  return data;
};

export const getThumbnailUrl = (baseUrl: string, thumb: string, args: any): string => formatUrl(`${baseUrl}${thumb}`, args);

export const getThumbnailTranscodeUrl = (h: number, w: number, baseUrl: string, thumb: string, token: string): string => {
  const params = {
    width: w,
    height: h,
    minSize: 1,
    upscale: 1,
    url: `${thumb}?X-Plex-Token=${token}`,
    'X-Plex-Token': token,
  };

  return formatUrl(`${baseUrl}/photo/:/transcode`, params);
};

export const MUSIC_LIBRARY_DISPAY_TYPE = {
  artist: { title: 'Author', key: 8 },
  album: { title: 'Book', key: 9 },
};

export const SORT_ORDER = {
  ascending: 'Ascending',
  descending: 'Decending',
};

// TODO: this whole thing needs to be cleaned up and refactored. It's really rough.
export const createLibrarySortQuery = ({ order, display }): any => {
  const args: any = {};

  // Set the default value for display
  if (!display) args.type = MUSIC_LIBRARY_DISPAY_TYPE.album.key;
  else if (display === MUSIC_LIBRARY_DISPAY_TYPE.album.title) args.type = MUSIC_LIBRARY_DISPAY_TYPE.album.key;
  else args.type = MUSIC_LIBRARY_DISPAY_TYPE.artist.key;

  if (!order) {
  // set a default order based on the album type.
    if (args.type === MUSIC_LIBRARY_DISPAY_TYPE.album.key) args.order = 'artist.titleSort,album.titleSort,album.index,album.id,album.originallyAvailableAt';
    else args.order = 'titleSort';
  } else {
    let desc = '';
    if (order === SORT_ORDER.descending) desc = ':desc';
    if (args.type === MUSIC_LIBRARY_DISPAY_TYPE.album.key) args.order = `artist.titleSort${desc},album.titleSort,album.index,album.id,album.originallyAvailableAt`;
    else args.order = `titleSort${desc}`;
  }

  return args;
};

type PlexLibraryItem = {

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
    sort: sortArgs.order,
  };
  const params = { ...BASE_PARAMS, ...localParams, ...args };
  const url = formatUrl(`${baseUrl}/library/sections/${section}/all`, params);

  const response = await fetch(url, GET_REQUEST);

  ///if (sortArgs.type === MUSIC_LIBRARY_DISPAY_TYPE.artist.key) {
    //const data: PlexArtistMediaContainer = await response.json();
    //console.log("getArtistLibraryItems", data.MediaContainer);
    //return data.MediaContainer;
  //}
  ///const data: PlexAlbumMediaContainer = await response.json();
  //console.log("getAlbumLibraryItems", data.MediaContainer);
  const data = await response.json();
  return data.MediaContainer;
};

export const getAlbumMetadata = async (baseUrl: string, itemId: string, args: any): Promise<PlexAlbumMetadata> => {
  const localParams = { };
  const params = { ...BASE_PARAMS, ...localParams, ...args };
  const url = formatUrl(`${baseUrl}/library/metadata/${itemId}/children`, params);

  const response = await fetch(url, GET_REQUEST);
  const data: PlexAlbumMediaContainer = await response.json();
  return data.MediaContainer;
};

export const getArtistMetadata = async (baseUrl: string, itemId: string, args: any): Promise<PlexArtistMetadata> => {
  const localParams = { };
  const params = { ...BASE_PARAMS, ...localParams, ...args };
  const url = formatUrl(`${baseUrl}/library/metadata/${itemId}/children`, params);

  const response = await fetch(url, GET_REQUEST);
  const data: PlexArtistMediaContainer = await response.json();
  return data.MediaContainer;
};

export const scrobble = async (baseUrl: string, key: string, token: string): Promise<void> => {
  const localParams = {
    key, // ratingKey
    'X-Plex-Token': token,
    identifier: 'com.plexapp.plugins.library',
  };

  // Using unscrobble to not add to play count - scrobble endpoint takes same
  // params and does effectively the same thing however.
  const params = { ...BASE_PARAMS, ...localParams };
  const url = formatUrl(`${baseUrl}/:/scrobble`, params);
  // const response =
  await fetch(url, GET_REQUEST);
  // const data = await response.json();

  // we don't need to do anything, need to handle error.
};

export const unscrobble = async (baseUrl: string, key: string, token: string): Promise<void> => {
  const localParams = {
    key, // ratingKey
    'X-Plex-Token': token,
    identifier: 'com.plexapp.plugins.library',
  };

  const params = { ...BASE_PARAMS, ...localParams };
  const url = formatUrl(`${baseUrl}/:/unscrobble`, params);

  // const response =
  await fetch(url, GET_REQUEST);
  // const data = await response.json();

  // we don't need to do anything, need to handle error.
};

export const progress = async (baseUrl: string, args: any): Promise<any> => {
  const localParams = {
    identifier: 'com.plexapp.plugins.library',
  };

  const params = { ...BASE_PARAMS, ...localParams, ...args };
  const url = formatUrl(`${baseUrl}/:/progress`, params);

  const response = await fetch(url, GET_REQUEST);
  const data = await response.json();
  return data;
};

export const updateTimeline = async (baseUrl: string, args: any): Promise<any> => {
  const localParams = {
    hasMDE: 0,
    'X-Plex-Text-Format': 'plain',
  };

  const params = { ...BASE_PARAMS, ...localParams, ...args };
  const url = formatUrl(`${baseUrl}/:/timeline`, params);

  const response = await fetch(url, GET_REQUEST);
  const data = await response.json();
  return data;
};

declare global {
  type PlexArtistMediaContainer = {
      MediaContainer: PlexArtistMetadata
  }
  type PlexAlbumMediaContainer = {
      MediaContainer: PlexAlbumMetadata
  }

  // Artist?? Is this the same as others???
  type PlexArtistMetadata = {
      Metadata: Array<PlexAlbumMetadata>,
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
  type PlexAlbumMetadata = {
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
      Collection: Array<PlexTag>
  };

  type PlexTag = {
      tag: string
  }
}