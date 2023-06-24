import { useEffect } from "react"
import { useAppSelector, useAppDispatch } from '@/store'
import { getLibraryItems } from '@/store/features/librarySlice'

import type { PlexAlbumMetadata, PlexArtistListMetadata } from "@/types/plex.types"

type HookReturn = {
    libraryItems: (PlexAlbumMetadata | PlexArtistListMetadata)[],
    loading: boolean
}

const useLibraryItems = (): HookReturn => {
    
    // TODO: Evaluate = should the library items be global state?
    // They are currently stored as such to cache and avoid refetching - perhaps RTK Query would be better?
    const dispatch = useAppDispatch();

    const activeServer = useAppSelector(state => state.server.activeServer);
    const displayType = useAppSelector(state => state.library.displayType);
    const sortType = useAppSelector(state => state.library.sortType);
  
    const libraryId = useAppSelector(state => state.library.libraryId);

    const libraryItems = useAppSelector(state => state.library.items);

    const loading = useAppSelector(state => state.library.isLoading);
    const serverLoading = useAppSelector(state => state.server.isLoading);
    const appState = useAppSelector(state => state.application.state);

    useEffect(() => {
        if (activeServer && libraryId) {
          dispatch(getLibraryItems());
        }
    }, [activeServer, libraryId, displayType, sortType]);

    return { libraryItems, loading: loading || serverLoading || appState === 'loading' }
}

export default useLibraryItems;