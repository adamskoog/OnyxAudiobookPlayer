import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux'

import Menu from '../Menu';

import { markTrackPlayed, markTrackUnplayed } from '../../plex/Playback';

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

const markPlayed = async (trackInfo, baseUrl, accessToken, updateAlbumInfo) => {
    await markTrackPlayed(trackInfo , baseUrl, accessToken);
    updateAlbumInfo();
};

const markUnplayed = async (trackInfo, baseUrl, accessToken, updateAlbumInfo) => {
    await markTrackUnplayed(trackInfo , baseUrl, accessToken)
    updateAlbumInfo();
};

const TrackMenu = ({ trackInfo, playSelectedTrack, updateAlbumInfo }) => {

    const accessToken = useSelector(state => state.settings.accessToken);
    const baseUrl = useSelector(state => state.application.baseUrl);

    const [isOpen, setIsOpen] = useState(false);

    const menuItems = [
        { title: 'Play', callback: () => playSelectedTrack(trackInfo) },
        { title: 'Mark as Played', callback: () => markPlayed(trackInfo, baseUrl, accessToken, updateAlbumInfo) },
        { title: 'Mark as Unplayed', callback: () => markUnplayed(trackInfo, baseUrl, accessToken, updateAlbumInfo) },
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