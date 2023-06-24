import { useContext } from 'react';

import type { PlexAlbumMetadata, PlexArtistListMetadata } from '@/types/plex.types';

import { ScrollerRefContext } from '@/components/Layout';
import AlbumItem from './AlbumItem';
import ArtistItem from './ArtistItem';
import Loader from '../shared/Loader';

import useLibraryItems from './hooks/useLibraryItems';

// No types for this - VirtualGrid.d.ts sets to any
import VirtualGrid from 'react-responsive-virtual-grid'

type GridChildProps = {
    style: any,
    index: any,
    children: Array<PlexAlbumMetadata | PlexArtistListMetadata>,
    readyInViewport: boolean,
    scrolling: boolean
}

function isPlexAlbumMetadata(album: PlexAlbumMetadata | PlexArtistListMetadata): album is PlexAlbumMetadata {
    return (album as PlexAlbumMetadata).parentGuid !== undefined;
}

function GridChild({ style, index, children, readyInViewport, scrolling }: GridChildProps) {

    const child = children[index];
    return (
      <div style={{ ...style }}>
        {isPlexAlbumMetadata(child) ? (
            <AlbumItem metadata={child} />
        ) : (
            <ArtistItem metadata={child} />
        )}
      </div>
    );
};

function Library() {

    const containerRef = useContext(ScrollerRefContext);

    const { libraryItems, loading } = useLibraryItems();
    
    if (loading) return <Loader loading={true} />
    if (loading || libraryItems.length === 0) return <div></div>

    return (
        <VirtualGrid
            total={libraryItems.length}
            cell={{ height: 255, width: 180 }}
            child={GridChild}
            childProps={{ children: libraryItems }}
            viewportRowOffset={4}
            scrollContainer={containerRef?.ref?.current}
        />
    );
}

export default Library;