import React, { useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';

import { useAppSelector, useAppDispatch } from '../../context/hooks';

import PlayerRangeControl from './controls/PlayerRangeControl';
import PreviousTrackControl from './controls/PreviousTrack';
import SkipBackControl from './controls/SkipBack';
import PlayPauseControl from './controls/PlayPause';
import SkipForwardControl from './controls/SkipForward';
import NexTrackControl from './controls/NextTrack';
import StopControl from './controls/Stop';

import throttle from 'lodash/throttle';
import { convertSecondsToMs, convertMsToSeconds } from '../../utility/time';
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

    const dispatch = useAppDispatch();
    
    const accessToken = useAppSelector(state => state.settings.accessToken);
    const baseUrl = useAppSelector(state => state.application.baseUrl);
    const queueId = useAppSelector(state => state.playQueue.id);
    const queue = useAppSelector(state => state.playQueue.queue);
    const queueIndex = useAppSelector(state => state.playQueue.index);
    const playState = useAppSelector(state => state.player.mode);

    function usePrevious(value: any) {
        const ref = useRef();
        useEffect(() => {
          ref.current = value;
        });
        return ref.current;
    };

    const prevIndex = usePrevious(queueIndex);
    const prevQueue: any = usePrevious(queueId);        //TODO: is this the correct value, prevQueue.id is used below....
    const playerRef: any = useRef(null);

    function hasTrackChanged() {
        // we need to do something here to check if the
        // track has been changed.
        if (prevQueue && prevQueue.id !== queueId) return true;
        if (prevIndex !== queueIndex) return true;
        return false;
    };

    const playerRangeChanged = (evt) => {
        const playerElement: HTMLAudioElement = playerRef.current;
        playerElement.currentTime = evt.target.value;
    };

    const playTrack = () => {
        const playerElement: HTMLAudioElement = playerRef.current;
        playerElement.play();
        dispatch(changePlayState(PlayState.PLAY_STATE_PLAYING));
    };

    const pauseTrack = () => {
        const playerElement: HTMLAudioElement = playerRef.current;
        playerElement.pause();

        updateTimeline(queue[queueIndex], PlayState.PLAY_STATE_PAUSED, playerElement.currentTime, playerElement.duration);
        dispatch(changePlayState(PlayState.PLAY_STATE_PAUSED));
    };

    const stopTrack = () => {
        const playerElement: HTMLAudioElement = playerRef.current;
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
        const playerElement: HTMLAudioElement = playerRef.current;
        let newTime = playerElement.currentTime - 10;
        if (newTime < 0)
            newTime = 0;
        playerElement.currentTime = newTime;
    };

    const skipForward = (skipTime: number) => {
        const playerElement: HTMLAudioElement = playerRef.current;
        let newTime = playerElement.currentTime + skipTime;
        if (newTime > playerElement.duration)
            newTime = playerElement.duration
        playerElement.currentTime = newTime;
    };

    const updateTimeline = (trackInfo: any, playState: any, currentTime: any, duration: any) => {
        // we need a way to update the album info if the user is looking at the album
        // page, It should keep the on deck updated.
        // Should this be done while playing, or only when user pauses/kills the stream.
        if (!baseUrl || !accessToken) return;
        let args = {
            ratingKey: trackInfo.ratingKey,
            key: trackInfo.key,
            state: playState,
            time: convertSecondsToMs(currentTime),
            playbackTime: convertSecondsToMs(currentTime),
            duration: convertSecondsToMs(duration),
            "X-Plex-Token": accessToken
        };
        //console.log("updateTimeline", args);
        updateTimelineApi(baseUrl, args)
            .then(data => { /*console.log("data", data); TODO: This doesn't seem to return anything, and errors out often.*/ });
    };

    const timeUpdated = (event) => {
        dispatch(changePlayerTime(event.target.currentTime, event.target.duration));
    };

    
    const audioPlayerEnded = useCallback((event) => {
        let nextIndex = queueIndex + 1;
        if (queue && queue.length > nextIndex) {
            dispatch(nextTrackInQueue());
        } else {
            stopPlayer();
        }
    }, [queueIndex, queue]);

    const throttleTimeline = throttle(() => {
        const playerElement: HTMLAudioElement = playerRef.current;
        if (!playerElement.paused) {
           updateTimeline(queue[queueIndex], PlayState.PLAY_STATE_PLAYING, playerElement.currentTime, playerElement.duration);
        }
    }, 4000, {trailing: false});

    useEffect(() => {
        const playerElement: HTMLAudioElement = playerRef.current;
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
                const src = formatUrl(`${baseUrl}${currentTrack.Part[0].key}`, { "X-Plex-Token": accessToken });

                // get the reference to the audio tag.
                const playerElement: HTMLAudioElement = playerRef.current;
                playerElement.src = src;
                playerElement.currentTime = 0;
                if (playInfo.viewOffset) {
                    // Check if we have a viewOffset, if so set the offset to the players time.
                    playerElement.currentTime = convertMsToSeconds(playInfo.viewOffset);
                }
                playTrack();
            }
        }
    }, [queueId, queueIndex, accessToken]);

    return (
        <Container>
            <PlayerRangeControl playerRangeChanged={playerRangeChanged} />
            <PlayerControlContainer>
                <PreviousTrackControl />
                <SkipBackControl skipBackward={skipBackward} />
                <PlayPauseControl playTrack={playTrack} pauseTrack={pauseTrack}/>
                <SkipForwardControl skipForward={skipForward} />
                <NexTrackControl />
                <StopControl stopPlayer={stopPlayer} />
            </PlayerControlContainer>
            <audio ref={playerRef} onTimeUpdate={timeUpdated} onEnded={audioPlayerEnded} />
        </Container>
    ); 
}

export default AudioPlayer;