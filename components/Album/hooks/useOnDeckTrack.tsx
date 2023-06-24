import { useEffect, useState } from "react"
import { findOnDeck } from '@/plex/helpers';
import type { PlexAlbumMetadata, PlexTrack } from "@/types/plex.types"

type HookProps = {
    album: PlexAlbumMetadata
}

type HookReturn = {
    onDeck: PlexTrack | null
}

const useOnDeckTrack = ({ album }: HookProps): HookReturn => {

    const [onDeck, setOnDeck] = useState(null as PlexTrack | null);

    useEffect(() => {
        if (!album) {
            setOnDeck(null)
        }
        const fetchMetadata = async (): Promise<void> => {
                const nextOnDeck = findOnDeck(album);   
                setOnDeck(nextOnDeck);
        };
        fetchMetadata();
    }, [album]);

    return { onDeck }
}

export default useOnDeckTrack;