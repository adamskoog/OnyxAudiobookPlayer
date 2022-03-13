import React, { useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';

import { useSelector, useDispatch } from 'react-redux';

import PlayerRangeControl from './controls/PlayerRangeControl';
import PreviousTrackControl from './controls/PreviousTrack';
import SkipBackControl from './controls/SkipBack';
import PlayPauseControl from './controls/PlayPause';
import SkipForwardControl from './controls/SkipForward';
import NexTrackControl from './controls/NextTrack';
import StopControl from './controls/Stop';

import throttle from 'lodash/throttle';
import TimeUtils from '../../utility/time';
import { updateTimeline as updateTimelineApi, formatUrl } from '../../plex/Api';

import { clearPlayQueue, nextTrackInQueue } from "../../context/actions/playQueueActions";
import { changePlayState, changePlayerTime, PlayState } from "../../context/actions/playerActions";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
`;

const PlayerControlContainer = styled.div`
    display: flex;
    flex-grow: 1;
    align-items: center;
    justify-content: center;
    margin-bottom: 1.5rem;
`;

function AudioPlayer() {

    const dispatch = useDispatch();
    
    //const authToken = useSelector(state => state.application.authToken);
    const currentServer = useSelector(state => state.settings.currentServer);
    const baseUrl = useSelector(state => state.application.baseUrl);
    const queueId = useSelector(state => state.playQueue.id);
    const queue = useSelector(state => state.playQueue.queue);
    const queueIndex = useSelector(state => state.playQueue.index);
    const playState = useSelector(state => state.player.mode);

    const playerElement = document.getElementById("appPlayer");

    function usePrevious(value) {
        const ref = useRef();
        useEffect(() => {
          ref.current = value;
        });
        return ref.current;
    };

    const prevIndex = usePrevious(queueIndex);
    const prevQueue = usePrevious(queueId);

    function hasTrackChanged() {
        // we need to do something here to check if the
        // track has been changed.
        if (prevQueue && prevQueue.id !== queueId) return true;
        if (prevIndex !== queueIndex) return true;
        return false;
    };

    const playerRangeChanged = (evt) => {
        playerElement.currentTime = evt.target.value;
    };

    const playTrack = () => {
        playerElement.play();
        dispatch(changePlayState(PlayState.PLAY_STATE_PLAYING));
    };

    const pauseTrack = () => {
        playerElement.pause();

        updateTimeline(queue[queueIndex], PlayState.PLAY_STATE_PAUSED, playerElement.currentTime, playerElement.duration);
        dispatch(changePlayState(PlayState.PLAY_STATE_PAUSED));
    };

    const stopTrack = () => {
        playerElement.pause();

        updateTimeline(queue[queueIndex], PlayState.PLAY_STATE_STOPPED, playerElement.currentTime, playerElement.duration);
        dispatch(changePlayState(PlayState.PLAY_STATE_STOPPED));

        playerElement.src = "";
    };

    const stopPlayer = () => {
        stopTrack();
        dispatch(clearPlayQueue());
    };

    const skipBackward = () => {
        let newTime = playerElement.currentTime - 10;
        if (newTime < 0)
            newTime = 0;
        playerElement.currentTime = newTime;
    };

    const skipForward = (skipTime) => {
        let newTime = playerElement.currentTime + skipTime;
        if (newTime > playerElement.duration)
            newTime = playerElement.duration
        playerElement.currentTime = newTime;
    };

    const updateTimeline = (trackInfo, playState, currentTime, duration) => {
        // we need a way to update the album info if the user is looking at the album
        // page, It should keep the on deck updated.
        // Should this be done while playing, or only when user pauses/kills the stream.
        const authToken = currentServer.accessToken;
        let args = {
            ratingKey: trackInfo.ratingKey,
            key: trackInfo.key,
            state: playState,
            time: TimeUtils.convertSecondsToMs(currentTime),
            playbackTime: TimeUtils.convertSecondsToMs(currentTime),
            duration: TimeUtils.convertSecondsToMs(duration),
            "X-Plex-Token": authToken
        };
        //console.log("updateTimeline", args);
        updateTimelineApi(baseUrl, args)
            .then(data => { /*console.log("data", data); TODO: This doesn't seem to return anything, and errors out often.*/ });
    };

    const timeUpdated = (event) => {
        let appPlayer = event.target;
        dispatch(changePlayerTime(appPlayer.currentTime, appPlayer.duration));
    };

    
    const audioPlayerEnded = useCallback((event) => {
        let nextIndex = queueIndex + 1;
        if (queue && queue.length >= nextIndex) {
            dispatch(nextTrackInQueue());
        } else {
            stopPlayer();
        }
    });

    const throttleTimeline = throttle(() => {
        if (!playerElement.paused) {
           updateTimeline(queue[queueIndex], PlayState.PLAY_STATE_PLAYING, playerElement.currentTime, playerElement.duration);
        }
    }, 4000, {trailing: false});

    useEffect(() => {
        if (!playerElement) return;
        playerElement.addEventListener("timeupdate", throttleTimeline);
        return () => playerElement.removeEventListener("timeupdate", throttleTimeline);
    }, [queueId, queueIndex]);

    useEffect(() => {
        // No media to play
        if (queueIndex < 0 || queue.length === 0) return;

        //console.log("Track has changed", hasTrackChanged());
        if (hasTrackChanged()) {
            const playInfo = queue[queueIndex];
            const currentTrack = playInfo.Media[0];

            // Stop playback, if you change the source of the audio while
            // it's playing, there is an exception thrown in the console.
            if (playState === PlayState.PLAY_STATE_PLAYING) {
                //console.log("STOP: Track is playing, pause and remove source.");
                stopTrack();
            }

            // Probably need to handle multiparts in some way? Even if it's just a warning?
            if (currentTrack.Part[0]) {
                //console.log("START: Add source and start playing.", currentTrack);
                const authToken = currentServer.accessToken;
                const src = formatUrl(`${baseUrl}${currentTrack.Part[0].key}`, { "X-Plex-Token": authToken });

                // get the reference to the audio tag.
                playerElement.src = src;
                playerElement.currentTime = 0;
                if (playInfo.viewOffset) {
                    // Check if we have a viewOffset, if so set the offset to the players time.
                    playerElement.currentTime = TimeUtils.convertMsToSeconds(playInfo.viewOffset);
                }
                playTrack();
            }
        }
    }, [queueId, queueIndex, currentServer]);

    return (
        <>
            <Container>
                <PlayerRangeControl playerRangeChanged={playerRangeChanged} />
                <PlayerControlContainer>
                    <PreviousTrackControl />
                    <SkipBackControl skipBackward={skipBackward} />
                    <PlayPauseControl playTrack={playTrack} pauseTrack={pauseTrack}/>
                    <SkipForwardControl skipForward={skipForward} />
                    <NexTrackControl />
                </PlayerControlContainer>
            </Container>
            <StopControl stopPlayer={stopPlayer} />
            <audio id="appPlayer" onTimeUpdate={timeUpdated} onEnded={audioPlayerEnded} />
        </>
    ); 
}

export default AudioPlayer;