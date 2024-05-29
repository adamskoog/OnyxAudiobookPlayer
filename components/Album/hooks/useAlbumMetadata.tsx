import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAppSelector } from '@/store'

import PlexJavascriptApi from '@adamskoog/jsapi-for-plex';
import type { PlexAlbumMetadata, PlexTrack } from '@adamskoog/jsapi-for-plex/plex.types'

type HookProps = {
    ratingKey: string
}

type HookReturn = {
    album: PlexAlbumMetadata | undefined,
    tracks: PlexTrack[] | undefined,
    loading: boolean,
    forceMetadataUpdate: () => Promise<void>
}

const useAlbumMetadata = ({ ratingKey }: HookProps): HookReturn => {
    
    const queryClient = useQueryClient();

    const activeServer = useAppSelector((state) => state.server.activeServer);

    const { isFetching: isFetchingAlbum, data: albumData } = useQuery({
       queryKey: ['album', ratingKey, { activeServer: activeServer?.clientIdentifier }],
       queryFn: () => PlexJavascriptApi.getAlbumMetadata(ratingKey),
       enabled: activeServer !== null
    });

    const { isFetching: isFetchingTracks, data: tracksData } = useQuery({
        queryKey: ['tracks', ratingKey, { activeServer: activeServer?.clientIdentifier }],
        queryFn: () => PlexJavascriptApi.getAlbumTracks(ratingKey),
        enabled: activeServer !== null
    });

    const isLoading = isFetchingAlbum && isFetchingTracks;

    const forceMetadataUpdate = async (): Promise<void> => {
        queryClient.invalidateQueries({ queryKey: ['tracks' ] });
    };
   
    return { album: albumData, tracks: tracksData, loading: isLoading, forceMetadataUpdate }
}

export default useAlbumMetadata;