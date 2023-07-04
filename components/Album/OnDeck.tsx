import { Loader } from '@mantine/core';

import { UnstyledButton } from '@mantine/core';
import { useAppDispatch } from '@/store';
import { buildPlayQueue } from '@/store/features/playerSlice';
import type { PlexAlbumMetadata, PlexTrack } from "@/types/plex.types"
import useOnDeckTrack from "./hooks/useOnDeckTrack"

import { getAlbumQueue } from '@/plex/helpers';

import styles from './styles/OnDeck.module.css'

type OnDeckProps = {
    album: PlexAlbumMetadata,
    tracks: PlexTrack[]
}

export default function OnDeck({ album, tracks }: OnDeckProps) {

    const dispatch = useAppDispatch();
    const { onDeck, isPlaying } = useOnDeckTrack({ album, tracks });

    const playTrack = (track: PlexTrack): void => {
        dispatch(buildPlayQueue(getAlbumQueue(track, tracks)));
    };

    if (!onDeck) return <></>

    return (
        <>
        {isPlaying ? (
            <div className={`${styles.container}`}>
                <Loader color="orange" size="xs" variant="bars" />
                <span>{onDeck.title}</span>
            </div>
        ) : (
            <UnstyledButton className={`${styles.container}`} title={'Play Next Track'} onClick={() => playTrack(onDeck)}>
                <svg width="1.75rem" height="1.75rem" viewBox="0 0 16 16" className="bi bi-x-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                    <path fillRule="evenodd" d="m 12.654334,8.697 -6.3630006,3.692 c -0.54,0.313 -1.233,-0.066 -1.233,-0.697 V 4.308 c 0,-0.63 0.692,-1.01 1.233,-0.696 l 6.3630006,3.692 a 0.802,0.802 0 0 1 0,1.393 z"/>
                </svg>
                <span>{onDeck.title}</span>
            </UnstyledButton>
        )}
        </>
    )
}
