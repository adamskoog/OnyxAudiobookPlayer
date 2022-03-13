import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

import * as Responsive from '../util/responsive';
import { getThumbnailTranscodeUrl } from '../../plex/Api';

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
    
    color: #fff;
    background-color: rgba(31, 41, 55, 1);
    
    height: 0px;
    &.playing {
        height: 100px;
    }
`;
const AlbumImage = styled.img`
    height: 100px;
    width: 100px;

    display: none;
    ${Responsive.smallMediaQuery(`
        display: block;
    `)}
`;
const InfoContainer = styled.div`
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

    color: ${(props) => (props.fontColor) ? props.fontColor : '#fff'};
`;

const NowPlaying = (props) => {

    const containerRef = useRef(null);

    const accessToken = useSelector(state => state.settings.accessToken);
    const baseUrl = useSelector(state => state.application.baseUrl);
    const playState = useSelector(state => state.player.mode);
    const currentTrack = useSelector(state => state.playQueue.currentTrack);
        
    const getThumbnailUrl = () => {
        if (!currentTrack) return "";
        return getThumbnailTranscodeUrl(100, 100, baseUrl, currentTrack.thumb, accessToken);
    };

    const getPlayInfoAttr = (attr) => {
        if (!currentTrack) return "";
        return currentTrack[attr];
    };
    
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
    }, [accessToken]);

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

    return (
        <Container ref={containerRef}>
            <AlbumImage src={getThumbnailUrl()} alt="album art" />
            <InfoContainer>
                <TextBlock>{getPlayInfoAttr("title")}</TextBlock>
                <TextBlock fontColor={"rgba(209, 213, 219, 1)"}><Link to={`/album/${getPlayInfoAttr("parentRatingKey")}`}>{getPlayInfoAttr("parentTitle")}</Link></TextBlock>
                <TextBlock fontColor={"rgba(209, 213, 219, 1)"}>{getPlayInfoAttr("grandparentTitle")}</TextBlock>
                <PlayerTime />
            </InfoContainer>
            <AudioPlayer />
        </Container>
    );
}

export default NowPlaying;
