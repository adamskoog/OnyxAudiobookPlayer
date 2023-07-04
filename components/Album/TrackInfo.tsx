import { useEffect, useState, ReactNode } from 'react'
import { Menu, UnstyledButton } from '@mantine/core';

import { useAppSelector, useAppDispatch } from '@/store';
import { buildPlayQueue } from '@/store/features/playerSlice';

import type { PlexAlbumMetadata, PlexTrack } from "@/types/plex.types"
import { getAlbumQueue, updateOnDeck } from '@/plex/helpers';

import { formatTrackDisplay } from "@/utility"
import { trackIsComplete, markTrackPlayed, markTrackUnplayed } from "@/plex/helpers";

import TrackMenuIcon from '@/assets/menuEllipses.svg'

import styles from './styles/TrackInfo.module.css'

type CellProps = {
    className?: string | undefined,
    children: ReactNode
}

function Cell({ className, children }: CellProps) {
    return (<div className={`${styles.cell} ${className ?? ''}`}>{children}</div>);
}

type ProgressProps = {
    track: PlexTrack
}

function Progress({ track }: ProgressProps) {

    const currentTrack = useAppSelector(state => state.player.currentTrack);
    const [nowPlaying, setNowPlaying] = useState(false);

    useEffect(() => {
        setNowPlaying(track.ratingKey === currentTrack?.ratingKey)
    }, [track, currentTrack])

    if (nowPlaying || track.viewOffset || track.viewCount) {
        if (!nowPlaying && trackIsComplete(track)) {
            return (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-circle-fill" viewBox="0 0 16 16">
                  <circle cx="8" cy="8" r="8"/>
              </svg>
            );
        }
        return (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-circle-half" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M8 15V1a7 7 0 1 1 0 14zm0 1A8 8 0 1 1 8 0a8 8 0 0 1 0 16z"/>
            </svg>
        );
    }
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-circle" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
        </svg>
    );
}

type TrackProps = {
    track: PlexTrack,
    tracks: PlexTrack[],
    forceMetadataUpdate: () => Promise<void>
}

export default function TrackInfo({ track, tracks, forceMetadataUpdate }: TrackProps) {

    const dispatch = useAppDispatch();

    const [isOpen, setIsOpen] = useState(false);

    const playTrack = (): void => {
        const callAsync = async () => {
            await updateOnDeck(track, tracks);
            await forceMetadataUpdate();
            dispatch(buildPlayQueue(getAlbumQueue(track, tracks)));
        }
        callAsync();
    };

    const markPlayed = (): void => {
        const callAsync = async () => {
            await markTrackPlayed(track);
            await forceMetadataUpdate();
        }
        callAsync();

    };
    
    const markUnplayed = (): void => {
        const callAsync = async () => {
            await markTrackUnplayed(track);
            await forceMetadataUpdate();
        }
        callAsync();
    };

    const menus = [
        { title: 'Play', callback: () => playTrack() },
        { title: 'Mark as Played', callback: () => markPlayed() },
        { title: 'Mark as Unplayed', callback: () => markUnplayed() },
    ];
    
    return (
        <>
            <Cell><Progress track={track} /></Cell>
            <Cell>{track.index}</Cell>
            <Cell>{track.title}</Cell>
            <Cell>{formatTrackDisplay(track.duration)}</Cell>
            <Cell className={`${styles.menu_cell}`}>
                <Menu opened={isOpen} onChange={setIsOpen} width={200}>
                    <Menu.Target>
                        <UnstyledButton className={`${styles.menu_icon}`} title={''} onClick={() => setIsOpen(!isOpen)}>
                            <TrackMenuIcon />
                        </UnstyledButton>
                    </Menu.Target>
                    <Menu.Dropdown>
                    <>
                        {menus.map(menu => (
                            <Menu.Item key={menu.title} onClick={menu.callback}>{menu.title}</Menu.Item>
                        ))}
                    </>
                    </Menu.Dropdown>
                </Menu>
            </Cell>
        </>
    )
}
