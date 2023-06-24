import { useState, ReactNode } from 'react'
import { Menu, UnstyledButton } from '@mantine/core';

import type { PlexTrack } from "@/types/plex.types"

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

type TrackProps = {
  track: PlexTrack
}

function Progress({ track }: TrackProps) {
    if (track.viewOffset || track.viewCount) {
        if (trackIsComplete(track)) {
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

export default function TrackInfo({ track }: TrackProps) {

    const [isOpen, setIsOpen] = useState(false)
    
    const playSelectedTrack = (trackInfo: PlexTrack) => {};
    const updateAlbumInfo = () => {};

    const markPlayed = async (trackInfo: any, updateAlbumInfo: any): Promise<void> => {
        await markTrackPlayed(trackInfo);
        updateAlbumInfo();
    };
    
    const markUnplayed = async (trackInfo: any, updateAlbumInfo: any): Promise<void> => {
        await markTrackUnplayed(trackInfo);
        updateAlbumInfo();
    };

    const menus = [
        { title: 'Play', callback: () => playSelectedTrack(track) },
        { title: 'Mark as Played', callback: () => markPlayed(track, updateAlbumInfo) },
        { title: 'Mark as Unplayed', callback: () => markUnplayed(track, updateAlbumInfo) },
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
