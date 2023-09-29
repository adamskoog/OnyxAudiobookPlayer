import { useEffect, useState } from "react"
import { useAppSelector, useAppDispatch } from '@/store';
import { findOnDeck } from '@/plex/helpers';
import type { PlexAlbumMetadata, PlexTrack } from "@/types/plex.types"

type HookProps = {
    album: PlexAlbumMetadata,
    tracks: PlexTrack[]
}

type HookReturn = {
    onDeck: PlexTrack | null,
    isPlaying: boolean
}

const useOnDeckTrack = ({ album, tracks }: HookProps): HookReturn => {

    const [onDeck, setOnDeck] = useState<PlexTrack | null>(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    const playState = useAppSelector(state => state.player.mode);
    const currentTrack = useAppSelector(state => state.player.currentTrack);

    useEffect(() => {
        if (!tracks) {
            setOnDeck(null);
            return;
        }

        if (playState === 'playing' || playState === 'paused') {
            if (currentTrack?.parentRatingKey === album.ratingKey) {
                setIsPlaying(true);
                setOnDeck(currentTrack);
                return;
            }
        }

        const nextOnDeck = findOnDeck(tracks);   
        setIsPlaying(false);
        setOnDeck(nextOnDeck);        
    }, [album, tracks, playState, currentTrack]);

    return { onDeck, isPlaying }
}

export default useOnDeckTrack;