import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import { useSelector } from 'react-redux'

import TimeUtils from '../../utility/time';
import PlexPlayback from '../../plex/Playback';

import Menu from './Menu';

import { ReactComponent as TrackCompleteSvg } from '../../assets/trackComplete.svg';
import { ReactComponent as TrackInProgressSvg } from '../../assets/trackInProgress.svg';
import { ReactComponent as TrackUnplayedSvg } from '../../assets/trackUnplayed.svg';

const trackStatus = (trackInfo) => {
    if (trackInfo.viewOffset || trackInfo.viewCount) {
        if (PlexPlayback.trackIsComplete(trackInfo)) {
            return "complete";
        } else {
            return "in-progress";
        }
    }
    return "";
};

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

const TrackCell = styled.div``;

const AlbumItem = ({ trackInfo, playSelectedTrack, updateAlbumInfo }) => {

    const authToken = useSelector(state => state.application.authToken);
    const baseUrl = useSelector(state => state.application.baseUrl);
    const currentTrack = useSelector(state => state.playQueue.currentTrack);

    const [isOpen, setIsOpen] = useState(false);

    const closeMenu = () => {
        if (isOpen) setIsOpen(false);
    }

    useEffect(() => {
        document.addEventListener("click", closeMenu);
        return () => { document.removeEventListener("click", closeMenu); }
    }, [isOpen]);

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
                {trackStatus(trackInfo) === "" && (<TrackUnplayedSvg />)}
                {trackStatus(trackInfo) === "in-progress" && (<TrackInProgressSvg />)}
                {trackStatus(trackInfo) === "complete" && (<TrackCompleteSvg />)}
            </TrackCell>
            <TrackCell>{trackInfo.index}</TrackCell>
            <TrackCell>{trackInfo.title}</TrackCell>
            <TrackCell>{TimeUtils.formatTrackDisplay(trackInfo.duration)}</TrackCell>
            <TrackCell>
                <Menu
                    trackInfo={trackInfo}
                    baseUrl={baseUrl}
                    authToken={authToken}
                    playSelectedTrack={playSelectedTrack}
                    markPlayed={markPlayed}
                    markUnplayed={markUnplayed}
                    updateAlbumInfo={updateAlbumInfo}
                    setIsOpen={setIsOpen}
                    isOpen={isOpen}
                />
            </TrackCell>
        </>
    ); 
}

export default AlbumItem;
