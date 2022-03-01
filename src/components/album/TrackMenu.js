import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux'

import { Transition } from '@headlessui/react'

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
//z-50 origin-top-right absolute right-0 mt-2 
//w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5
const Menu = styled.div`
    transform-origin: top right;
    z-index: 50;
    width: 12rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    position: absolute;
    right: 0px;
    padding-top: 0.25rem;
    padding-bottom: 0.25rem;
    margin-top: 0.5rem;
    border-radius: 0.375rem;
    background-color: rgba(255, 255, 255, 1);
`;
//block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer
const MenuItem = styled.div`
    color: rgba(55, 65, 81, 1);
    padding: .5rem 1rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
    cursor: pointer;

    &:hover {
        background-color: rgba(243, 244, 246, 1);
    }
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

    const closeMenu = () => {
        if (isOpen) setIsOpen(false);
    }

    useEffect(() => {
        document.addEventListener("click", closeMenu);
        return () => { document.removeEventListener("click", closeMenu); }
    }, [isOpen]);
    
    return (
        <Container>
            <ContainerOffset>
                <MenuButton onClick={() => setIsOpen(!isOpen)} id="user-menu" aria-haspopup="true">
                    <EllipsesSvg />
                </MenuButton>

                <Transition
                    show={isOpen}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95">
                    {(ref) => (
                        <Menu ref={ref} role="menu" aria-orientation="vertical" aria-labelledby="user-menu">
                            <MenuItem role="menuitem" onClick={() => playSelectedTrack(trackInfo)}>Play</MenuItem>
                            <MenuItem role="menuitem" onClick={() => markPlayed(trackInfo, baseUrl, authToken, updateAlbumInfo)}>Mark as Played</MenuItem>
                            <MenuItem role="menuitem" onClick={() => markUnplayed(trackInfo, baseUrl, authToken, updateAlbumInfo)}>Mark as Unplayed</MenuItem>
                        </Menu>
                    )}
                </Transition>
            </ContainerOffset>
        </Container>
    ); 
}

export default TrackMenu;