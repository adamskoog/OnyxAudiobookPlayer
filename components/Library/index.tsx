'use client'
import { useContext } from 'react';

import type { PlexAlbumMetadata, PlexArtistListMetadata, PlexCollectionMetadata } from '@/types/plex.types';

import { ScrollerRefContext } from '@/components/Layout';
import AlbumItem from './AlbumItem';
import ArtistItem from './ArtistItem';
import Loader from '../shared/Loader';

import { loadSettingFromStorage, SETTINGS_KEYS, FEATURE_FLAG } from '@/utility';

import useLibraryItems from './hooks/useLibraryItems';

// No types for this - VirtualGrid.d.ts sets to any
import VirtualGrid from 'react-responsive-virtual-grid'
import CollectionItem from './CollectionItem';

type GridChildProps = {
    style: any,
    index: any,
    children: Array<PlexAlbumMetadata | PlexArtistListMetadata>,
    readyInViewport: boolean,
    scrolling: boolean
}

function isPlexAlbumMetadata(album: PlexAlbumMetadata | PlexArtistListMetadata | PlexCollectionMetadata): album is PlexAlbumMetadata {
    return (album as PlexAlbumMetadata).parentGuid !== undefined;
}
function isPlexCollectionMetadata(collection: PlexAlbumMetadata | PlexArtistListMetadata | PlexCollectionMetadata): collection is PlexCollectionMetadata {
    return (collection as PlexCollectionMetadata).type === 'collection';
}

function GridChild({ style, index, children, readyInViewport, scrolling }: GridChildProps) {

    const child = children[index];
    
    let childElement = <></>

    if (isPlexCollectionMetadata(child)) childElement = <CollectionItem metadata={child} />
    else if (isPlexAlbumMetadata(child)) childElement = <AlbumItem metadata={child} showAuthor={true} />
    else childElement = <ArtistItem metadata={child} />

    return (
      <div style={{ ...style }}>
        {childElement}
      </div>
    );
};

function Library() {

    const containerRef = useContext(ScrollerRefContext);

    const { libraryItems, loading } = useLibraryItems();
    
    if (loading) return <Loader loading={true} />
    if (loading || libraryItems.length === 0) return <div></div>

    // This is a temp feature flag for testing.
    if (loadSettingFromStorage(SETTINGS_KEYS.storeLibraryScrollPosition) === FEATURE_FLAG.ON) {
        // we only want to set if we are on root library path.
        const scroller = containerRef?.ref?.current;
        const scrollPos = sessionStorage.getItem('libraryScrollPosition')
        if (!!scroller && !!scrollPos) {
            scroller.scrollTo({ top: parseInt(scrollPos) })
        }
    }

    return (
        <VirtualGrid
            total={libraryItems.length}
            cell={{ height: 260, width: 180 }}
            child={GridChild}
            childProps={{ children: libraryItems }}
            viewportRowOffset={4}
            scrollContainer={containerRef?.ref?.current}
        />
    );
}

export default Library;