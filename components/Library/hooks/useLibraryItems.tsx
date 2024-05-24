import { useQuery } from "@tanstack/react-query";
import { useAppSelector } from '@/store'

import PlexJavascriptApi from '@/plex';

import type { PlexAlbumMetadata, PlexArtistListMetadata, PlexCollectionMetadata } from "@/types/plex.types"

type HookReturn = {
    libraryItems: (PlexAlbumMetadata | PlexArtistListMetadata | PlexCollectionMetadata)[],
    loading: boolean
}

const useLibraryItems = (): HookReturn => {
    
    const activeServer = useAppSelector(state => state.server.activeServer);
    const displayType = useAppSelector(state => state.library.displayType);
    const sortType = useAppSelector(state => state.library.sortType);
  
    const libraryId = useAppSelector(state => state.library.libraryId);

    const serverLoading = useAppSelector(state => state.server.isLoading);
    const appState = useAppSelector(state => state.application.state);

    const sortArgs = PlexJavascriptApi.createLibrarySortQuery({ display: displayType, order: sortType });

    const { isFetching, data: libraryItems } = useQuery({
        queryKey: ['library', libraryId, sortArgs],
        queryFn: () => PlexJavascriptApi.getLibraryItems(libraryId, sortArgs),
        enabled: activeServer !== null && libraryId !== null
    });

    return { libraryItems: libraryItems ?? [], loading: isFetching || serverLoading || appState === 'loading' }
}

export default useLibraryItems;