import { useEffect, useState } from "react"
import { useAppSelector } from '@/store'

import PlexJavascriptApi from '@/plex';
import type { PlexAlbumMetadata } from "@/types/plex.types"

type HookProps = {
    ratingKey: string
}

type HookReturn = {
    album: PlexAlbumMetadata | null,
    loading: boolean,
    forceMetadataUpdate: () => Promise<void>
}

const useAlbumMetadata = ({ ratingKey }: HookProps): HookReturn => {
    
    const activeServer = useAppSelector((state) => state.server.activeServer);

    const [album, setAlbum] = useState<PlexAlbumMetadata | null>(null);
    const [loading, setLoading] = useState(false)

    const forceMetadataUpdate = async (): Promise<void> => {
        // Do no set loading, doing a background refresh.
        const albumInfo = await PlexJavascriptApi.getAlbumMetadata(ratingKey);       
        setAlbum(albumInfo);
    };

    useEffect(() => {
        const fetchMetadata = async (): Promise<void> => {
            if (activeServer) {
                const albumInfo = await PlexJavascriptApi.getAlbumMetadata(ratingKey);       
                setAlbum(albumInfo);
                setLoading(false)
            };
        };
        setLoading(true)
        fetchMetadata();
    }, [activeServer, ratingKey]);

    return { album, loading, forceMetadataUpdate }
}

export default useAlbumMetadata;