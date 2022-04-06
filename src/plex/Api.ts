import axios, { AxiosInstance } from 'axios';
import qs from 'qs';
import * as Bowser from "bowser";
import { v4 as uuidv4 } from 'uuid';

import * as Settings from '../utility/settings';
import { StyledInterface } from 'styled-components';

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
    private static needsLogin: boolean = false;

    private static requestTokenParam: Object = {
      'X-Plex-Token': null
    };
    private static requestBaseParams: Object = {
        'X-Plex-Device-Name': "Onyx",
        'X-Plex-Product': 'Onyx Audiobook Player',
        'X-Plex-Version': '0.9.2',
        'X-Plex-Client-Identifier': null
    };

    static get baseParams() {
        return PlexTvApi.requestBaseParams;
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
            const response = await this.validatePin(authId);
            token = response.token;
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
    static validateToken = async (): Promise<UserInfo> => {
      
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
          this.logout();

          return { message: 'Unexpected error occurred.' };
        }
    };

    /**
     * Do user sign in request
     * @returns Promise<any> - TODO
     */
    static signIn = async (): Promise<any> => {
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

        return { url: authAppUrl };
    };

    /**
     * Get the resources based on the authenticated user.
     * @param id string - the auth id obtained from plex.tv
     * @returns Promise<any> - TODO
     */
    private static validatePin = async (id: string): Promise<any> => {

      // console.log("ID", id);
      const clientIdParams = { 'X-Plex-Client-Identifier': this.requestBaseParams['X-Plex-Client-Identifier'] };
      // console.log("TEST", { ...clientIdParams });

      const url = `${this.PLEX_BASE_URL}${this.PLEX_PINS_URL}/${id}?${qs.stringify(clientIdParams)}`;
      // console.log("URL", url);

      const response = await axios.get(url);
      // console.log("RESP", response);
      Settings.removeSettingFromStorage(Settings.SETTINGS_KEYS.loginRedirectId);
      Settings.saveSettingToStorage(Settings.SETTINGS_KEYS.token, response.data.authToken);
      Settings.saveSettingToStorage(Settings.SETTINGS_KEYS.clientIdentifier, this.requestBaseParams['X-Plex-Client-Identifier']);
    
      return { token: response.data.authToken };
    };

    /**
     * After login redirect - get the id from storage to finish authentication.
     */    
    static getAuthenticationId = (): string | null => {
      const authId = Settings.loadSettingFromStorage(Settings.SETTINGS_KEYS.loginRedirectId);
      if (authId && authId !== '') return authId;
      return null;
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

    /**
     * Clear application storage to log out of the application.
     */   
    static logout = (): void => {
      Settings.clearSettings();
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
    private static baseUrl: string | null;
    private static requestTokenParam: Object = {
      'X-Plex-Token': null
    };

    static initialize = async (resource: any | null): Promise<ServerConnection> => {
        console.log("PLEX RESOURCE", resource);
        if (!resource)
            return { message: 'No resource selected' };

        // This class is initialized by a server being selected.
        // This can happen on load or from the Settings page.
        const connection = await this.serverConnectionTest(resource);
        

        if (connection.uri) {
          this.baseUrl = connection.uri ?? null;
          this.client = axios.create({
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

    private static fetchWithTimeout = async (url: string, options: any): Promise<any> => {
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

    /**
     * Run connection tests for a server to determine the best connection to use.
     * @param {PlexResource} resource - The plex resource instance that represents the active server.
     * @returns {Promise<ServerConnection>} - the preferred connection uri or error.
     */
    private static serverConnectionTest = (resource: PlexResource): Promise<ServerConnection> => new Promise((resolve, reject) => {
      
      // TODO: handle this better with base params.
      this.requestTokenParam['X-Plex-Token'] = resource.accessToken;

      const params = { ...PlexTvApi.baseParams, ...this.requestTokenParam };
      const connections = resource.connections;
      const connectionPromises = connections.map((connection: any) => {

        // Use different timeout lengths for local vs remote servers.
        // TODO: the local timeout was too short and failing after login.
        const timeout = 5000; ///(connection.local) ? 1000 : 5000;

        // Identity endpoint is very small, used by other projects.
        return this.fetchWithTimeout(formatUrl(`${connection.uri}/identity`, params), {
          timeout,
        });
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
   
    /**
     * Get a list of libraries for the currently selection server connection.
     * @returns Promise<Array<PlexLibrary>> - array of libraries that match audio type.
     */
    static getLibraries = async (): Promise<Array<PlexLibrary>> => {
      const response = await this.client.get(`/library/sections`, {
        params: {
            ...PlexTvApi.baseParams,
            ...this.requestTokenParam
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
     * @returns {string} - the url of the transcoded image.
     */
    static getThumbnailTranscodeUrl = (h: number, w: number, thumb: string): string => {
      const params = {
        width: w,
        height: h,
        minSize: 1,
        upscale: 1,
        url: `${thumb}?X-Plex-Token=${this.requestTokenParam['X-Plex-Token']}`,
        ...this.requestTokenParam
      };
      return formatUrl(`${this.baseUrl}/photo/:/transcode`, params);
    };

    /**
     * Mark the track referenced by the key as watched/listened.
     * @param {string} key - the key of the requested track.
     */
    static scrobble = async (key: string): Promise<void> => {

      await this.client.get(`/:/scrobble`, {
        params: {
            key, // ratingKey
            identifier: 'com.plexapp.plugins.library',
            ...PlexTvApi.baseParams,
            ...this.requestTokenParam
        }
      });
    
      // we don't need to do anything, need to handle error.
    };
    
    /**
     * Mark the track referenced by the key as watched/listened.
     * @param {string} key - the key of the requested track.
     */
    static unscrobble = async (key: string): Promise<void> => {
      await this.client.get(`/:/unscrobble`, {
        params: {
            key, // ratingKey
            identifier: 'com.plexapp.plugins.library',
            ...PlexTvApi.baseParams,
            ...this.requestTokenParam
        }
      });
       
      // we don't need to do anything, need to handle error.
    };

    /**
     * @deprecated
     * I'm not really sure what this does anymore - it doesn't appear to be used.
     */
    static progress = async (args: any): Promise<any> => {
    
      const response = await this.client.get(`/:/progress`, {
        params: {
            identifier: 'com.plexapp.plugins.library',
            ...PlexTvApi.baseParams,
            ...this.requestTokenParam,
            ...args
        }
      });
      return response.data;
    };

    /**
     * Update the play progress of the current track on the server
     * @param {any} args - TODO: this is a bunch of information to process the request, break up.
     */
    static updateTimeline = async (args: any): Promise<any> => {

      const response = await this.client.get(`/:/timeline`, {
        params: {
            identifier: 'com.plexapp.plugins.library',
            ...PlexTvApi.baseParams,
            ...this.requestTokenParam,
            ...args,
            hasMDE: 0,
            'X-Plex-Text-Format': 'plain',
        }
      });
      return response.data;
    };

    /**
     * Determine the correct media to play from the server.
     * TODO: this doesn't do much, just grabs the first item.
     * @param {PlexTrackMedia} track - The track object to determine media.
     */
    static getTrackMediaUrl = (track: PlexTrackMedia): string => {
        return formatUrl(`${this.baseUrl}${track.Part[0].key}`, this.requestTokenParam);
    };
 
    /**
     * Get the metadata of the requested Album.
     * @param {string} ratingKey - The key of the requested item
     */
    static getAlbumMetadata = async (ratingKey: string): Promise<PlexAlbumMetadata> => {

      const response = await this.client.get(`/library/metadata/${ratingKey}/children`, {
        params: {
            ...PlexTvApi.baseParams,
            ...this.requestTokenParam
        }
      });

      const data: PlexAlbumMediaContainer = response.data;
      return data.MediaContainer;
    };

    /**
     * Get the metadata of the requested Artist.
     * @param {string} ratingKey - The key of the requested item
     */
    static getArtistMetadata = async (ratingKey: string): Promise<PlexArtistMetadata> => {
      const response = await this.client.get(`/library/metadata/${ratingKey}/children`, {
        params: {
            ...PlexTvApi.baseParams,
            ...this.requestTokenParam
        }
      });

      const data: PlexArtistMediaContainer = response.data;
      return data.MediaContainer;
    };

    // TODO: this whole thing needs to be cleaned up and refactored. It's really rough.
    static createLibrarySortQuery = ({ order, display }): any => {
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
     * @param {string} section - The library section.
     * @param {any} args - The information for sorting.
     */
    static getLibraryHubItems = async (section: string, args: any): Promise<any> => {
        const localParams = {
          type: 9,
          includeAdvanced: 1,
          includeMeta: 1,
          includeCollections: 1,
          includeExternalMedia: 1
        };

        const response = await this.client.get(`/library/sections/${section}/all`, {
          params: {
              ...PlexTvApi.baseParams,
              ...localParams,
              ...args,
              ...this.requestTokenParam
          }
        });

        return response.data.MediaContainer;
    };

    /**
     * The the media items to display in the library.
     * @param {string} section - The library section.
     * @param {any} sortArgs - The information for sorting.
     */
    static getLibraryItems = async (section: string, sortArgs?: any): Promise<any> => {
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

      const response = await this.client.get(`/library/sections/${section}/all`, {
        params: {
            ...PlexTvApi.baseParams,
            ...localParams,
            ...this.requestTokenParam
        }
      });

      ///if (sortArgs.type === MUSIC_LIBRARY_DISPAY_TYPE.artist.key) {
        //const data: PlexArtistMediaContainer = await response.json();
        //console.log("getArtistLibraryItems", data.MediaContainer);
        //return data.MediaContainer;
      //}
      return response.data.MediaContainer;
    };
};

declare global {

  // API Types
  type ServerConnection = {
      uri?: string,
      message?: string,
      error?: string
  }



  // Plex Types
  type PlexUser = {
      id: number,
      authToken: string,
      email: string,
      friendlyName: string,
      pin: string,
      thumb: string,
      title: string,
      username: string
  }

  type PlexResource = {
      accessToken: string,
      clientIdentifier: string,
      name: string,
      connections: Array<PlexResourceConnection>,
      createdAt: string,
      device: string,
      dnsRebindingProtection: boolean,
      home: boolean,
      httpsRequired: boolean,
      lastSeenAt: string,
      natLoopbackSupported: boolean
      owned: boolean
      //ownerId: null
      platform: string,
      platformVersion: string,
      presence: boolean,
      product: string,
      productVersion: string,
      provides: string,
      publicAddress: string,
      publicAddressMatches: boolean
      relay: boolean,
      //sourceTitle: null
      synced: boolean
  }

  type PlexResourceConnection = {
      uri: string,
      local: boolean,
      IPv6: boolean,
      address: string,
      port: number,
      protocol: string,
      relay: boolean
  }

  type PlexLibrary = {
    agent: string,
    allowSync: boolean,
    art: string,
    composite: string,
    content: boolean,
    contentChangedAt: number,
    createdAt: number,
    directory: boolean,
    filters: boolean,
    hidden: number,
    key: string,
    language: string,
    refreshing: boolean,
    scannedAt: number,
    scanner: string,
    thumb: string,
    title: string,
    type: string,
    updatedAt: number,
    uuid: string
  }

  type PlexTrack = {
      ratingKey: string,
      key: string,
      title: string,
      thumb: string,
      parentTitle: string,
      parentRatingKey: string,
      grandparentTitle: string,
      viewOffset: number,
      Media: Array<PlexTrackMedia>
  }

  type PlexTrackMedia = {
      id: number,
      audioChannels: number,
      audioCodec: string,
      bitrate: number,
      container: string,
      duration: number,
      Part: Array<PlexTrackMediaPart>
  }
  type PlexTrackMediaPart = {
      id: number,
      container: string,
      duration: number,
      file: string,
      hasThumbnail: string,
      key: string,
      size: number

  }

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