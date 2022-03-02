import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux'

import Menu from '../Menu';

import PlexPlayback from '../../plex/Playback';

import { ReactComponent as EllipsesSvg } from '../../assets/menuEllipses.svg';

const Container = styled.div`
    display: flex;
    align-items: center;
`;
const ContainerOffset = styled.div`
    position: relative;
`;
const MenuButton = styled.button`
    font-size: 1.125rem;
    line-height: 1.75rem;
`;

const markPlayed = (trackInfo, baseUrl, authToken, updateAlbumInfo) => {
    PlexPlayback.markTrackPlayed(trackInfo , baseUrl, authToken)
		.then(() => {
			updateAlbumInfo();
		});
};

const markUnplayed = (trackInfo, baseUrl, authToken, updateAlbumInfo) => {
    PlexPlayback.markTrackUnplayed(trackInfo , baseUrl, authToken)
        .then(() => {
            updateAlbumInfo();
        });
};

const TrackMenu = ({ trackInfo, playSelectedTrack, updateAlbumInfo }) => {

    const authToken = useSelector(state => state.application.authToken);
    const baseUrl = useSelector(state => state.application.baseUrl);

    const [isOpen, setIsOpen] = useState(false);

    const menuItems = [
        { title: 'Play', callback: () => playSelectedTrack(trackInfo) },
        { title: 'Mark as Played', callback: () => markPlayed(trackInfo, baseUrl, authToken, updateAlbumInfo) },
        { title: 'Mark as Unplayed', callback: () => markUnplayed(trackInfo, baseUrl, authToken, updateAlbumInfo) },
    ];

    useEffect(() => {
        if (!isOpen) return;

        const closeMenu = () => {
            if (isOpen) setIsOpen(false);
        }

        document.addEventListener("click", closeMenu);
        return () => { document.removeEventListener("click", closeMenu); }
    }, [isOpen]);

    return (
        <Container>
            <ContainerOffset>
                <MenuButton onClick={() => setIsOpen(!isOpen)} id="track-menu" aria-haspopup="true">
                    <EllipsesSvg />
                </MenuButton>
                <Menu isOpen={isOpen} labelledby={'track-menu'} children={menuItems} />
            </ContainerOffset>
        </Container>
    ); 
}

export default TrackMenu;