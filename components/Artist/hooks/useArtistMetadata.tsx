import { useQuery } from "@tanstack/react-query";
import { useAppSelector } from '@/store'

import PlexJavascriptApi from '@/plex';
import type { PlexArtistMetadata } from "@/types/plex.types"

type HookProps = {
    ratingKey: string
}

type HookReturn = {
    artist: PlexArtistMetadata | undefined,
    loading: boolean
}

const useArtistMetadata = ({ ratingKey }: HookProps): HookReturn => {
    
    const activeServer = useAppSelector((state) => state.server.activeServer);

    const { isFetching, data } = useQuery({
        queryKey: ['artist', ratingKey, { activeServer: activeServer?.clientIdentifier }],
        queryFn: () => PlexJavascriptApi.getArtistMetadata(ratingKey),
        enabled: activeServer !== null
    });

    return { artist: data, loading: isFetching }
}

export default useArtistMetadata;