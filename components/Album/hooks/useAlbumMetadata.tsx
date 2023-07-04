import { useEffect, useState } from "react"
import { useAppSelector } from '@/store'

import PlexJavascriptApi from '@/plex';
import type { PlexAlbumMetadata, PlexTrack } from "@/types/plex.types"

type HookProps = {
    ratingKey: string
}

type HookReturn = {
    album: PlexAlbumMetadata | null,
    tracks: PlexTrack[] | null,
    loading: boolean,
    forceMetadataUpdate: () => Promise<void>
}

const useAlbumMetadata = ({ ratingKey }: HookProps): HookReturn => {
    
    const activeServer = useAppSelector((state) => state.server.activeServer);

    const [album, setAlbum] = useState<PlexAlbumMetadata | null>(null);
    const [tracks, setTracks]= useState<PlexTrack[] | null>(null);
    const [loading, setLoading] = useState<boolean>(false)

    const forceMetadataUpdate = async (): Promise<void> => {
        // Do no set loading, doing a background refresh.
        const trackInfo = await PlexJavascriptApi.getAlbumTracks(ratingKey);       
        setTracks(trackInfo);
    };

    useEffect(() => {
        const fetchMetadata = async (): Promise<void> => {
            if (activeServer) {
                const albumInfo = await PlexJavascriptApi.getAlbumMetadata(ratingKey);       
                setAlbum(albumInfo);

                const trackInfo = await PlexJavascriptApi.getAlbumTracks(ratingKey);
                setTracks(trackInfo);
                setLoading(false)
            };
        };
        setLoading(true)
        fetchMetadata();
    }, [activeServer, ratingKey]);

    return { album, tracks, loading, forceMetadataUpdate }
}

export default useAlbumMetadata;