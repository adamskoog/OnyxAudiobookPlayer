import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

import * as Responsive from '../util/responsive';
import { PLAYER_HEIGHT } from '../util/global';
import PlexImage from '../util/PlexImage';
import { Link } from 'react-router-dom';
import PlayerTime from './controls/PlayerTime';
import AudioPlayer from './AudioPlayer';

const Container = styled.div`
    display: ${(props) => (props.show) ? 'flex' : 'none'};
    height: ${(props) => (props.show) ? PLAYER_HEIGHT : '0px'};

    flex-direction: row;
    flex-wrap: nowrap;
    flex-grow: 0;
    align-items: center;
    justify-content: space-evenly;
    
    color: ${({ theme }) => theme.PLAYER_TEXT};
    background-color: ${({ theme }) => theme.PLAYER_BACKGROUND};
`;
const AlbumImageContainer = styled.div`
    display: none;
    ${Responsive.smallMediaQuery(`
        display: block;
    `)}
`;
const InfoContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: .2rem;

    margin-left: 0.45rem;
    margin-right: 0.45rem;
    max-width: 120px; 

    ${Responsive.mediumMediaQuery(`
        margin-left: 0.75rem;
        margin-right: 0.75rem;
        max-width: 180px; 
    `)}
    
`;
const TextBlock = styled.div`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    color: ${(props) => (props.muted) ? props.theme.PLAYER_TEXT_MUTED : props.theme.PLAYER_TEXT }    
`;

const NowPlaying = () => {

    const playState = useSelector(state => state.player.mode);
    const currentTrack = useSelector(state => state.playQueue.currentTrack);
    
    const [trackThumbUrl, setTrackThumbUrl] = useState(null);
    const [trackTitle, setTrackTitle] = useState('');
    const [albumTitle, setAlbumTitle] = useState('');
    const [albumKey, setAlbumKey] = useState('');
    const [artistName, setArtistName] = useState('');
   
    useEffect(() => {
        if (currentTrack) {
            setTrackThumbUrl(currentTrack.thumb);
            setTrackTitle(currentTrack.title);
            setAlbumTitle(currentTrack.parentTitle);
            setAlbumKey(currentTrack.ratingKey);
            setArtistName(currentTrack.grandparentTitle);
        } else {
            setTrackThumbUrl(null);
            setTrackTitle('');
            setAlbumTitle('');
            setAlbumKey('');
            setArtistName('');
        }
    }, [currentTrack]);

    return (
        <Container show={(playState !== "stopped") ? true : false}>
            <AlbumImageContainer>
                <PlexImage width={100} height={100} url={trackThumbUrl} alt={trackTitle} hideRadius={true} />
            </AlbumImageContainer>
            <InfoContainer>
                <TextBlock>{trackTitle}</TextBlock>
                <TextBlock muted={true}>
                    <Link to={`/album/${albumKey}`}>{albumTitle}</Link>
                </TextBlock>
                <TextBlock muted={true}>{artistName}</TextBlock>
                <PlayerTime />
            </InfoContainer>
            <AudioPlayer />
        </Container>
    );
}

export default NowPlaying;
