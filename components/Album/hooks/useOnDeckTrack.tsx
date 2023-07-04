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
    const currentTrack = useAppSelector(state => state.player.currentTrack)

    useEffect(() => {
        if (!album) {
            setOnDeck(null)
        }
        const fetchMetadata = async (): Promise<void> => {
                const nextOnDeck = findOnDeck(tracks);   
                setOnDeck(nextOnDeck);
        };
        fetchMetadata();
    }, [album, tracks]);

    useEffect(() => {
        
        if (playState === 'playing' || playState === 'paused') {
            if (currentTrack?.parentRatingKey === album.ratingKey) {
                setIsPlaying(true);
                return;
            }
        } 
        
        setIsPlaying(false);
    }, [playState, currentTrack])

    return { onDeck, isPlaying }
}

export default useOnDeckTrack;