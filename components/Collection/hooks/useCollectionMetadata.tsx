import { useQuery } from "@tanstack/react-query";
import { useAppSelector } from '@/store'

import PlexJavascriptApi from '@/plex';
import type { PlexAlbumMetadata, PlexCollectionMetadata } from "@/types/plex.types"

type HookProps = {
    ratingKey: string
}

type HookReturn = {
    collection: PlexCollectionMetadata | undefined,
    albums: PlexAlbumMetadata[] | undefined,
    loading: boolean
}

const useCollectionMetadata = ({ ratingKey }: HookProps): HookReturn => {
    
    const activeServer = useAppSelector((state) => state.server.activeServer);

    const { isFetching: isFetchingMetadata, data: metadataData } = useQuery({
        queryKey: ['collection-metadata', ratingKey, { activeServer: activeServer?.clientIdentifier }],
        queryFn: () => PlexJavascriptApi.getCollectionMetadata(ratingKey),
        enabled: activeServer !== null
     });
 
     const { isFetching: isFetchingCollection, data: collectionData } = useQuery({
         queryKey: ['collection-items', ratingKey, { activeServer: activeServer?.clientIdentifier }],
         queryFn: () => PlexJavascriptApi.getCollectionItems(ratingKey),
         enabled: activeServer !== null
     });
 
     const isLoading = isFetchingMetadata && isFetchingCollection;

    return { collection: metadataData, albums: collectionData, loading: isLoading }
}

export default useCollectionMetadata;