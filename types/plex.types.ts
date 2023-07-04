export type PlexServerConnection = {
    uri?: string,
    message?: string,
    error?: string
};

export type PlexUser = {
    id: number,
    authToken: string,
    email: string,
    friendlyName: string,
    pin: string,
    thumb: string,
    title: string,
    username: string,
    home: boolean
};

export type SwitchUserItem = {
    id: number,
    uuid: string,
    admin: boolean,
    restricted: boolean,
    protected: boolean,
    title: string,
    username: string,
    email: string,
    thumb: string
}

export type PlexResourceConnection = {
    uri: string,
    local: boolean,
    IPv6: boolean,
    address: string,
    port: number,
    protocol: string,
    relay: boolean
};

export type PlexResource = {
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
};

export type PlexLibrary = {
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
};

export type PlexTimelineArgs = {
    ratingKey: string,
    key: string,
    state: string,
    time: number,
    playbackTime: number,
    duration: number,
};

export type PlexBandwidth = {
    bandwidth: number,
    resolution: string,
    time: number
};

export type PlexProgress = {
    Bandwidths: Array<PlexBandwidth>,
    playbackState: string,
    size: number,
    skipCount: number,
    viewCount: number,
    viewOffset: number
};

export type PlexTrack = {
    ratingKey: string,
    key: string,
    title: string,
    thumb: string,
    parentTitle: string,
    parentRatingKey: string,
    grandparentTitle: string,
    viewOffset: number,
    index: number,
    Media: Array<PlexTrackMedia>
    duration: number,
    viewCount: number
};

export type PlexTrackMedia = {
    id: number,
    audioChannels: number,
    audioCodec: string,
    bitrate: number,
    container: string,
    duration: number,
    Part: Array<PlexTrackMediaPart>
};

export type PlexTrackMediaPart = {
    id: number,
    container: string,
    duration: number,
    file: string,
    hasThumbnail: string,
    key: string,
    size: number
};

// Artist?? Is this the same as others???
// TODO: the types here seem to not be correct
export type PlexArtistListMetadata = {
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
    ratingKey: string,
    size: number,
    summary: string,
    thumb: string,
    titleSort: string,
    title: string,
    viewGroup: string,
    viewMode: number 
}

export type PlexArtistMetadata = {
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
    ratingKey: string,
    size: number,
    summary: string,
    thumb: string,
    titleSort: string,
    title1: string,
    title2: string,
    viewGroup: string,
    viewMode: number
};

/// This comes from under Artist, same as media container on album view??
export type PlexAlbumMetadata = {
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
    parentYear: number,
    size: number,
    Collection: Array<PlexTag>
};

export type PlexCollectionMetadata = {
    ratingKey: string,
    key: string,
    guid: string,
    type: string,
    title: string,
    titleSort: string,
    subtype: string,
    summary: string,
    index: number,
    ratingCount: number,
    thumb: string,
    addedAt: number,
    updatedAt: number,
    childCount: string,
    maxYear: string,
    minYear: string
}

export type PlexTag = {
    tag: string
};