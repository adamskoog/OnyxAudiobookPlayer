import { useEffect, useState } from "react"
import { useAppSelector } from '@/store'

import PlexJavascriptApi from '@/plex';
import type { PlexAlbumMetadata, PlexCollectionMetadata } from "@/types/plex.types"

type HookProps = {
    ratingKey: string
}

type HookReturn = {
    collection: PlexCollectionMetadata | null,
    albums: PlexAlbumMetadata[] | null,
    loading: boolean
}

const useCollectionMetadata = ({ ratingKey }: HookProps): HookReturn => {
    
    const activeServer = useAppSelector((state) => state.server.activeServer);

    const [collection, setCollection] = useState<PlexCollectionMetadata | null>(null);
    const [albums, setAlbums] = useState<PlexAlbumMetadata[] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchMetadata = async (): Promise<void> => {
            if (activeServer) {
                const collectionInfo = await PlexJavascriptApi.getCollectionMetadata(ratingKey);       
                setCollection(collectionInfo);

                const albumsInfo = await PlexJavascriptApi.getCollectionItems(ratingKey);
                setAlbums(albumsInfo);

                setLoading(false)
            };
        };
        setLoading(true)
        fetchMetadata();
    }, [activeServer, ratingKey]);

    return { collection, albums, loading }
}

export default useCollectionMetadata;