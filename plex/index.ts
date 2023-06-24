import axios, { AxiosInstance } from 'axios';
import qs from 'qs';
import Bowser from "bowser";
import { v4 as uuidv4 } from 'uuid';

import type { PlexUser, PlexResource, PlexServerConnection, PlexLibrary, PlexTimelineArgs, PlexProgress, PlexArtistMetadata, PlexArtistListMetadata, PlexAlbumMetadata, PlexTrackMedia } from '@/types/plex.types'
import * as Settings from '@/utility/settings';

export const RESOURCETYPES = {
    server: 'server',
};

export const LIBRARYTYPES = {
    music: 'artist',
};

export const MUSIC_LIBRARY_DISPAY_TYPE = {
    artist: { title: 'Author', key: 8 },
    album: { title: 'Book', key: 9 }
};

export const SORT_ORDER = {
    ascending: 'Ascending',
    descending: 'Decending',
};

const formatUrl = (url: string, args: any): string => {
    const params = qs.stringify(args);
    if (params && params !== '') return `${url}?${params}`;
    return url;
};

const fetchWithTimeout = async (url: string, options: any): Promise<any> => {
    const { timeout = 8000 } = options;
  
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
  
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
  
    return response;
};

class PlexJavascriptApi {

    private static client: AxiosInstance;

    private static PLEX_BASE_URL: string = 'https://plex.tv';
    private static PLEX_RESOURCES_URL: string = '/api/v2/resources';
    private static PLEX_USER_URL = '/api/v2/user';
    private static PLEX_USERS_URL = '/api/home/users';
    private static PLEX_PINS_URL = '/api/v2/pins';

    private static isInitialized: boolean = false;
    private static needsLogin: boolean = false;

    private static requestTokenParam: any = {
      'X-Plex-Token': null
    };

    private static requestBaseParams: any = {
        'X-Plex-Device-Name': "Onyx",
        'X-Plex-Product': 'Onyx Audiobook Player',
        'X-Plex-Version': '0.9.2',
        'X-Plex-Client-Identifier': null
    };

    static get baseParams() {
        return PlexJavascriptApi.requestBaseParams;
    }

    static get authToken() {
        return this.requestTokenParam['X-Plex-Token'];
    }

    static get isLoggedOut() {
        return this.needsLogin;
    }

    private static generateClientId(): string {
        // We need to auto generate a guid to pass to the server
        // when this value doesn't exist
        const clientIdentifier = uuidv4();

        Settings.saveSettingToStorage(Settings.SETTINGS_KEYS.clientIdentifier, clientIdentifier);
        return clientIdentifier;
    };

    static initialize = async (): Promise<void> => {

        if (this.isInitialized) return;

        // Setup the browser information.
        const browser = Bowser.parse(window.navigator.userAgent);
        this.requestBaseParams['X-Plex-Device'] = browser.os.name;
        this.requestBaseParams['X-Plex-Platform'] = browser.browser.name;

        // We have not initialized, we need to check the browser storage
        // for plex.tv token, client identifier, and saved auth token.
        let token = Settings.loadSettingFromStorage(Settings.SETTINGS_KEYS.token);
        let clientIdentifier = Settings.loadSettingFromStorage(Settings.SETTINGS_KEYS.clientIdentifier);
        let authId = Settings.loadSettingFromStorage(Settings.SETTINGS_KEYS.loginRedirectId);

        if (!clientIdentifier) {
            // Set token to null - if we have no clientIdentifier, then we
            // are logged out and need to re-authenticate.
            token = null;
            Settings.clearSettings();

            // The client id is no longer available or valid, generate a new one.
            clientIdentifier = this.generateClientId();
        }
        this.requestBaseParams['X-Plex-Client-Identifier'] = clientIdentifier;
        
        // Create a client for plex.tv requests
        this.client = axios.create({
            baseURL: this.PLEX_BASE_URL,
            headers: {
              'Accept': 'application/json',
              'Content-type': 'application/json'
            }
        });

        // Check if we have an auth id saved, if so, we need
        // to validate the pin and get a token.
        if (authId) {
            token = await this.validatePin(authId);
        }

        if (!token) {
            // No token - we are logged out.
            this.needsLogin = true;
        } else {
            // The user is logged in, we need to save the token and client id
            // for use in query parameters.
            this.requestTokenParam['X-Plex-Token'] = token;
        }

        this.isInitialized = true;
    };

    /**
     * Check the stored auth token to make sure it is still valid for use.
     * @returns {Promise<PlexUser>} - a promise for the plex.tv user information.
     */
    static validateToken = async (): Promise<PlexUser> => {
      
        try {
          const response = await this.client.get(this.PLEX_USER_URL, {
            params: {
                ...this.requestBaseParams,
                ...this.requestTokenParam
            }
          });
          const data = response.data;
          if (data.errors) {
            throw { message: data.errors[0].message };
          }
          // Return the user information
          return data as PlexUser;
        } catch {
          this.requestTokenParam['X-Plex-Token'] = null;
          this.logout();

          throw { message: 'Unexpected error occurred.' };
        }
    };

    /**
     * Get the resources based on the authenticated user.
     * @param {string} id - the auth id obtained from plex.tv
     * @returns {Promise<string>} - the token associated to the current user.
     */
    private static validatePin = async (id: string): Promise<string> => {

        const clientIdParams = { 'X-Plex-Client-Identifier': this.requestBaseParams['X-Plex-Client-Identifier'] };
        const url = `${this.PLEX_BASE_URL}${this.PLEX_PINS_URL}/${id}?${qs.stringify(clientIdParams)}`;

        const response = await axios.get(url);
        Settings.removeSettingFromStorage(Settings.SETTINGS_KEYS.loginRedirectId);
        Settings.saveSettingToStorage(Settings.SETTINGS_KEYS.token, response.data.authToken);
        Settings.saveSettingToStorage(Settings.SETTINGS_KEYS.clientIdentifier, this.requestBaseParams['X-Plex-Client-Identifier']);
        
        return response.data.authToken as string;
    };

    /**
     * Do user sign in request
     * @returns {Promise<string>} - the specific oauth sign in id to authenticate with plex.tv.
     */
    static signIn = async (): Promise<string> => {
        const response = await this.client.post(this.PLEX_PINS_URL, null, {
          params: {
            strong: true,
            ...this.requestBaseParams
          }
        });

        // TODO: where should formatUrl live?
        const data = response.data;
        const authAppUrl = formatUrl(`https://app.plex.tv/auth#`, {
            clientID: this.requestBaseParams['X-Plex-Client-Identifier'],
            code: data.code,
            forwardUrl: window.location.href,
            context: {
                device: {
                    product: this.requestBaseParams['X-Plex-Product'],
                },
            },
        });

        // Save the pin to browser storage.
        Settings.saveSettingToStorage(Settings.SETTINGS_KEYS.loginRedirectId, data.id);

        return authAppUrl;
    };

    /**
     * Clear application storage to log out of the application.
     */   
    static logout = (): void => {
        Settings.clearSettings();
    };

    static getUsers = async (): Promise<any> => {
      const response = await this.client.get(this.PLEX_USERS_URL, {
          params: {
              ...this.requestBaseParams,
              ...this.requestTokenParam
          }
      });

      const parser = new DOMParser();
      const doc1 = parser.parseFromString(response.data, "application/xml");
      return doc1;
    }

    /**
     * Get the resources based on the authenticated user.
     * @param {string} resourceType - a specific resource to be retrieved.
     * @returns {Promise<Array<PlexResource>>} - an array of the resources that match the request.
     */
    static getResources = async (resourceType?: string): Promise<Array<PlexResource>> => {
        const response = await this.client.get(this.PLEX_RESOURCES_URL, {
            params: {
                includeHttps: 1,
                includeRelay: 1,
                ...this.requestBaseParams,
                ...this.requestTokenParam
            }
        });
        const resources: Array<PlexResource> = response.data;
        if (!resourceType) return resources; // return the unfilters resource reponse.   
        return resources.filter((resource: PlexResource) => resource.provides === resourceType);
    };

    /* Begin Server specific methods */
    /* ***************************** */

    private static serverClient: AxiosInstance;
    private static baseUrl: string | null;
    private static serverRequestTokenParam: any = {
      'X-Plex-Token': null
    };

    /**
     * Run connection tests for a server to determine the best connection to use.
     * @param {PlexResource} resource - The plex resource instance that represents the active server.
     * @returns {Promise<ServerConnection>} - the preferred connection uri or error.
     */
    private static serverConnectionTest = (resource: PlexResource): Promise<PlexServerConnection> => new Promise((resolve, reject) => {
    
        // TODO: handle this better with base params.
        this.requestTokenParam['X-Plex-Token'] = resource.accessToken;
    
        const params = { ...this.baseParams, ...this.requestTokenParam };
        const connections = resource.connections;
        const connectionPromises = connections.map((connection: any) => {
    
            // Use different timeout lengths for local vs remote servers.
            // TODO: the local timeout was too short and failing after login.
            const timeout = 5000; ///(connection.local) ? 1000 : 5000;
    
            // Identity endpoint is very small, used by other projects.
            return fetchWithTimeout(formatUrl(`${connection.uri}/identity`, params), { timeout });
        });
    
        Promise.allSettled(connectionPromises).then((values: any) => {
            let preferredConnection: string | null = null;
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

    static selectServer = async (resource: PlexResource | null): Promise<PlexServerConnection> => {
        if (!resource)
            return { message: 'No resource selected' };

        // Set the access token for the server.
        this.serverRequestTokenParam['X-Plex-Token'] = resource.accessToken;

        // This class is initialized by a server being selected.
        // This can happen on load or from the Settings page.
        const connection = await this.serverConnectionTest(resource);
        
        if (connection.uri) {
          // set the internal base url of the class
          this.baseUrl = connection.uri ?? null;
          if (!this.baseUrl) throw 'TODO: Could not connect to server.'

          this.serverClient = axios.create({
            baseURL: this.baseUrl,
            headers: {
              'Accept': 'application/json',
              'Content-type': 'application/json'
            }
          });
        }

        // Return the connection information - the url in the future
        // should not be needed in redux, but if an error has occurred 
        // we need to be able to handle it.
        return connection;
    };

    /**
     * Get a list of libraries for the currently selection server connection.
     * @returns {Promise<Array<PlexLibrary>>} - array of libraries that match audio type.
     */
    static getLibraries = async (): Promise<Array<PlexLibrary>> => {
        const response = await this.serverClient.get(`/library/sections`, {
          params: {
              ...this.baseParams,
              ...this.serverRequestTokenParam
          }
        });
        const data = response.data;
        const sections = data.MediaContainer.Directory;
      
        if (sections.length === 0) return [];
        return sections.filter((section: any) => section.type === LIBRARYTYPES.music);
    };

    /**
     * Get the url of an image from plex media server.
     * @param {number} h - the height in pixels of the requested image
     * @param {number} w - the width in pixels of the requested image
     * @param {string} thumb - the url of the requested image.
     * @param {boolean | undefined} minSize
     * @param {boolean | undefined} upscale
     * 
     * @returns {string} - the url of the transcoded image.
     */
    static getThumbnailTranscodeUrl = (h: number, w: number, thumb: string, minSize?: boolean | null, upscale?: boolean | null): string => {
      const params = {
        width: w,
        height: h,
        minSize: minSize ? 1 : 0,
        upscale: upscale ? 1 : 0,
        url: `${thumb}?X-Plex-Token=${this.serverRequestTokenParam['X-Plex-Token']}`,
        ...this.serverRequestTokenParam
      };
      return formatUrl(`${this.baseUrl}/photo/:/transcode`, params);
    };

    /**
     * Mark the track referenced by the key as watched/listened.
     * @param {string} key - the key of the requested track.
     */
    static scrobble = async (key: string): Promise<void> => {

      await this.serverClient.get(`/:/scrobble`, {
        params: {
            key, // ratingKey
            identifier: 'com.plexapp.plugins.library',
            ...this.baseParams,
            ...this.serverRequestTokenParam
        }
      });
    
      // we don't need to do anything, need to handle error.
    };
    
    /**
     * Mark the track referenced by the key as watched/listened.
     * @param {string} key - the key of the requested track.
     */
    static unscrobble = async (key: string): Promise<void> => {
      await this.serverClient.get(`/:/unscrobble`, {
        params: {
            key, // ratingKey
            identifier: 'com.plexapp.plugins.library',
            ...this.baseParams,
            ...this.serverRequestTokenParam
        }
      });
       
      // we don't need to do anything, need to handle error.
    };

    /**
     * Update the play progress of the current track on the server
     * @param {PlexTimelineArgs} args - the arguments needed to update the timeline.
     * @returns {Promise<PlexProgress>} - 
     */
    static updateTimeline = async ({ ratingKey, key, state, time, playbackTime, duration }: PlexTimelineArgs): Promise<PlexProgress> => {
        const response = await this.serverClient.get(`/:/timeline`, {
          params: {
              identifier: 'com.plexapp.plugins.library',
              ...this.baseParams,
              ...this.serverRequestTokenParam,
              ratingKey,
              key,
              state,
              time,
              playbackTime,
              duration,
              hasMDE: 0,
              'X-Plex-Text-Format': 'plain',
          }
        });
        return response.data.MediaContainer;
    };

    /**
     * Determine the correct media to play from the server.
     * TODO: this doesn't do much, just grabs the first item.
     * @param {PlexTrackMedia} track - The track object to determine media.
     * @returns {string} - 
     */
    static getTrackMediaUrl = (track: PlexTrackMedia): string => {
        return formatUrl(`${this.baseUrl}${track.Part[0].key}`, this.serverRequestTokenParam);
    };
 
    /**
     * Get the metadata of the requested Album.
     * @param {string} ratingKey - The key of the requested item
     * @returns {Promise<PlexAlbumMetadata>} - 
     */
    static getAlbumMetadata = async (ratingKey: string): Promise<PlexAlbumMetadata> => {

      // Merging the album information with the tracks so we have a consistent format.
      // It seems the plex web app makes two seperate requests to get this information
      // as well.
      const albumResponse = await this.serverClient.get(`/library/metadata/${ratingKey}`, {
        params: {
            ...this.baseParams,
            ...this.serverRequestTokenParam
        }
      });

      let album: PlexAlbumMetadata = albumResponse.data.MediaContainer.Metadata[0];
      const response = await this.serverClient.get(`/library/metadata/${ratingKey}/children`, {
        params: {
            ...this.baseParams,
            ...this.serverRequestTokenParam
        }
      });

      // Combine the tracks with the album metadata.
      album.Metadata = response.data.MediaContainer.Metadata;
      return album;
    };

    /**
     * Get the metadata of the requested Artist.
     * @param {string} ratingKey - The key of the requested item
     * @returns {Promise<PlexArtistMetadata>} - 
     */
    static getArtistMetadata = async (ratingKey: string): Promise<PlexArtistMetadata> => {
        const response = await this.serverClient.get(`/library/metadata/${ratingKey}/children`, {
          params: {
              ...this.baseParams,
              ...this.serverRequestTokenParam
          }
        });

        return response.data.MediaContainer;
    };

    // TODO: this whole thing needs to be cleaned up and refactored. It's really rough.
    static createLibrarySortQuery = ({ order, display }: any): any => {
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

    /**
     * Get the recently added and listened hub items.
     * The return type for this is a bit odd - the queries are actually against
     * the artists, so we get the artist metadata type back.
     * @param {string} section - The library section.
     * @param {Promise<Array<PlexAlbumMetadata>>} args - The albums matching the query.
     * @returns {Promise<Array<PlexAlbumMetadata>>} - 
     */
    static getLibraryHubItems = async (section: string, args: any): Promise<Array<PlexAlbumMetadata>> => {
        const localParams = {
          type: 9,
          includeAdvanced: 1,
          includeMeta: 1,
          includeCollections: 1,
          includeExternalMedia: 1
        };

        const response = await this.serverClient.get(`/library/sections/${section}/all`, {
          params: {
              ...this.baseParams,
              ...localParams,
              ...args,
              ...this.serverRequestTokenParam
          }
        });
        const data = response?.data?.MediaContainer as PlexArtistMetadata;
        if (!data) return [];
        return data.Metadata;
    };

    /**
     * The the media items to display in the library.
     * @param {string} section - The library section.
     * @param {any} sortArgs - The information for sorting.
     * @return {Promise<Array<PlexAlbumMetadata | PlexArtistListMetadata>}
     */
    static getLibraryItems = async (section: string, sortArgs?: any): Promise<Array<PlexAlbumMetadata | PlexArtistListMetadata>> => {
        if (!sortArgs) {
          sortArgs = this.createLibrarySortQuery({ order: null, display: null });
        }
      
        const localParams = {
          type: sortArgs.type,
          includeAdvanced: 1,
          includeMeta: 1,
          includeCollections: 1,
          includeExternalMedia: 1,
          sort: sortArgs.order,
        };
  
        const response = await this.serverClient.get(`/library/sections/${section}/all`, {
          params: {
              ...this.baseParams,
              ...localParams,
              ...this.serverRequestTokenParam
          }
        });
  
        return response.data.MediaContainer.Metadata ?? [];
    };
}

export default PlexJavascriptApi