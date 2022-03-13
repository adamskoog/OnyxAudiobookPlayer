import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

import * as Colors from '../util/colors';
import * as Responsive from '../util/responsive';

import PlexImage from '../util/PlexImage';
import { Link } from 'react-router-dom';
import PlayerTime from './controls/PlayerTime';
import AudioPlayer from './AudioPlayer';

const Container = styled.div`
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0px;
    overflow: hidden;

    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: space-evenly;
    
    color: ${Colors.LIGHT_PLAYER_TEXT};
    background-color: ${Colors.LIGHT_PLAYER_BACKGROUND};
    
    height: 0px;
    &.playing {
        height: 100px;
    }
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

    color: ${(props) => (props.fontColor) ? props.fontColor : Colors.LIGHT_PLAYER_TEXT};
`;

const NowPlaying = (props) => {

    const containerRef = useRef(null);

    const playState = useSelector(state => state.player.mode);
    const currentTrack = useSelector(state => state.playQueue.currentTrack);
    
    const [trackThumbUrl, setTrackThumbUrl] = useState(null);
    const [trackTitle, setTrackTitle] = useState('');
    const [albumTitle, setAlbumTitle] = useState('');
    const [albumKey, setAlbumKey] = useState('');
    const [artistName, setArtistName] = useState('');
   
    useEffect(() => {
        const main = props.containerRef.current;
        const player = containerRef.current;
        if (playState === "stopped") {
            main.classList.remove("playing");
            player.classList.remove("playing");
        } else {
            main.classList.add("playing");
            player.classList.add("playing");
        }
    }, [playState, props.containerRef]);

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
        <Container ref={containerRef}>
            <AlbumImageContainer>
                <PlexImage width={100} height={100} url={trackThumbUrl} alt={trackTitle} hideRadius={true} />
            </AlbumImageContainer>
            <InfoContainer>
                <TextBlock>{trackTitle}</TextBlock>
                <TextBlock fontColor={Colors.LIGHT_PLAYER_TEXT_MUTED}>
                    <Link to={`/album/${albumKey}`}>{albumTitle}</Link>
                </TextBlock>
                <TextBlock fontColor={Colors.LIGHT_PLAYER_TEXT_MUTED}>{artistName}</TextBlock>
                <PlayerTime />
            </InfoContainer>
            <AudioPlayer />
        </Container>
    );
}

export default NowPlaying;
