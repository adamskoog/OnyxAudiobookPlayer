import { useEffect, useState } from "react"
import { useAppSelector } from '@/store'

import PlexJavascriptApi from '@/plex';
import type { PlexArtistMetadata } from "@/types/plex.types"

type HookProps = {
    ratingKey: string
}

type HookReturn = {
    artist: PlexArtistMetadata | null,
    loading: boolean
}

const useArtistMetadata = ({ ratingKey }: HookProps): HookReturn => {
    
    const activeServer = useAppSelector((state) => state.server.activeServer);

    const [artist, setArtist] = useState<PlexArtistMetadata | null>(null);
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        const fetchMetadata = async (): Promise<void> => {
            if (activeServer) {
                const artistInfo = await PlexJavascriptApi.getArtistMetadata(ratingKey);       
                setArtist(artistInfo);
                setLoading(false)
            };
        };
        setLoading(true)
        fetchMetadata();
    }, [activeServer, ratingKey]);

    return { artist, loading }
}

export default useArtistMetadata;