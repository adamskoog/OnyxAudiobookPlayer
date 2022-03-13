import React, { useEffect } from 'react';
import styled from 'styled-components';

import { useSelector } from 'react-redux'

import TimeUtils from '../../utility/time';
import { trackIsComplete } from '../../plex/Playback';

import TrackMenu from './TrackMenu';

import { ReactComponent as TrackCompleteSvg } from '../../assets/trackComplete.svg';
import { ReactComponent as TrackInProgressSvg } from '../../assets/trackInProgress.svg';
import { ReactComponent as TrackUnplayedSvg } from '../../assets/trackUnplayed.svg';

const trackStatus = (trackInfo) => {
    if (trackInfo.viewOffset || trackInfo.viewCount) {
        if (trackIsComplete(trackInfo)) {
            return "complete";
        } else {
            return "in-progress";
        }
    }
    return "";
};

const TrackCell = styled.div``;

const AlbumItem = ({ trackInfo, playSelectedTrack, updateAlbumInfo }) => {

    const currentTrack = useSelector(state => state.playQueue.currentTrack);

    useEffect(() => {
        if (currentTrack && trackInfo) {
            if (currentTrack.key === trackInfo.key) {
                updateAlbumInfo();
            }
        }
    }, [currentTrack]);

    return (
        <>
            <TrackCell>
                {/* TODO: Refactor to component */}
                {trackStatus(trackInfo) === "" && (<TrackUnplayedSvg />)}
                {trackStatus(trackInfo) === "in-progress" && (<TrackInProgressSvg />)}
                {trackStatus(trackInfo) === "complete" && (<TrackCompleteSvg />)}
            </TrackCell>
            <TrackCell>{trackInfo.index}</TrackCell>
            <TrackCell>{trackInfo.title}</TrackCell>
            <TrackCell>{TimeUtils.formatTrackDisplay(trackInfo.duration)}</TrackCell>
            <TrackCell>
                <TrackMenu
                    trackInfo={trackInfo}
                    playSelectedTrack={playSelectedTrack}
                    updateAlbumInfo={updateAlbumInfo}
                />
            </TrackCell>
        </>
    ); 
}

export default AlbumItem;
