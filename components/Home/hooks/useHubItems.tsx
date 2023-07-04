import { useEffect, useState } from "react"

import { useAppSelector } from '@/store'
import type { PlexAlbumMetadata } from "@/types/plex.types"

type HookProps = {
    hubItemsCallback: () => Promise<Array<PlexAlbumMetadata>>
}

type HookReturn = {
    hubLoading: boolean,
    hubItems: Array<PlexAlbumMetadata>
}

const useHubItems = ({ hubItemsCallback }: HookProps): HookReturn => {
    
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [hubItems, setHubItems] = useState<PlexAlbumMetadata[]>([]);

    const section = useAppSelector((state) => state.library.libraryId);
    const applicationState = useAppSelector((state) => state.application.state);
    
    useEffect(() => {
        const doFetch = async (): Promise<void> => {
          if (applicationState === 'ready' && section) {
            setIsLoading(true);
            const data = await hubItemsCallback();
            setHubItems(data);
            setIsLoading(false);
          } else {
            setIsLoading(false);
            setHubItems([])
          };
        }; 
        doFetch();
    }, [section, applicationState]);

    return { hubLoading: isLoading, hubItems }
}

export default useHubItems;