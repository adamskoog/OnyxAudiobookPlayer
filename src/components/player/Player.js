import React, { useEffect, useRef, useCallback } from 'react';
import { connect } from 'react-redux';

import PlayerRangeControl from './controls/PlayerRangeControl';
import PreviousTrackControl from './controls/PreviousTrack';
import SkipBackControl from './controls/SkipBack';
import PlayPauseControl from './controls/PlayPause';
import SkipForwardControl from './controls/SkipForward';
import NexTrackControl from './controls/NextTrack';
import StopControl from './controls/Stop';

import throttle from 'lodash/throttle';
import TimeUtils from '../../utility/time';
import PlexPlayback from '../../plex/Playback';
import PlexApi from '../../plex/Api';

import * as playQueueActions from "../../context/actions/playQueueActions";
import * as playerActions from "../../context/actions/playerActions";

const mapStateToProps = state => {
    return { 
        authToken: state.application.authToken,
        baseUrl: state.application.baseUrl,
        queueId: state.playQueue.id,
        queue: state.playQueue.queue,
        queueIndex: state.playQueue.index,
        playState: state.player.mode
    };
};

 const mapDispatchToProps = dispatch => {
    return {
        clearPlayQueue: () => dispatch(playQueueActions.clearPlayQueue()),
        changePlayState: (state) => dispatch(playerActions.changePlayState(state)),
        changePlayerTime: (currentTime, duration) => dispatch(playerActions.changePlayerTime(currentTime, duration)),
        nextTrackInQueue: () => dispatch(playQueueActions.nextTrackInQueue())
    };
};

function ConnectedAudioPlayer(props) {

    const playerElement = document.getElementById("appPlayer");

    function usePrevious(value) {
        const ref = useRef();
        useEffect(() => {
          ref.current = value;
        });
        return ref.current;
    };

    const prevIndex = usePrevious(props.queueIndex);
    const prevQueue = usePrevious(props.queueId);

    function hasTrackChanged() {
        // we need to do something here to check if the
        // track has been changed.
        if (prevQueue && prevQueue.id !== props.queueId) return true;
        if (prevIndex !== props.queueIndex) return true;
        return false;
    };

    const playerRangeChanged = (evt) => {
        playerElement.currentTime = evt.target.value;
    };

    const playTrack = () => {
        playerElement.play();
        props.changePlayState(playerActions.PlayState.PLAY_STATE_PLAYING);
    };

    const pauseTrack = () => {
        playerElement.pause();

        updateTimeline(props.queue[props.queueIndex], playerActions.PlayState.PLAY_STATE_PAUSED, playerElement.currentTime, playerElement.duration);
        props.changePlayState(playerActions.PlayState.PLAY_STATE_PAUSED);
    };

    const stopTrack = () => {
        playerElement.pause();

        updateTimeline(props.queue[props.queueIndex], playerActions.PlayState.PLAY_STATE_STOPPED, playerElement.currentTime, playerElement.duration);
        props.changePlayState(playerActions.PlayState.PLAY_STATE_STOPPED);

        playerElement.src = "";
    };

    const stopPlayer = () => {
        stopTrack();
        props.clearPlayQueue();
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
        let args = {
            ratingKey: trackInfo.ratingKey,
            key: trackInfo.key,
            state: playState,
            time: TimeUtils.convertSecondsToMs(currentTime),
            playbackTime: TimeUtils.convertSecondsToMs(currentTime),
            duration: PlexPlayback.timelineTrackDurationFlex(TimeUtils.convertSecondsToMs(duration)),
            "X-Plex-Token": props.authToken
        };
        //console.log("updateTimeline", args);
        PlexApi.updateTimeline(props.baseUrl, args)
            .then(data => { /*console.log("data", data); TODO: This doesn't seem to return anything, and errors out often.*/ });
    };

    const timeUpdated = (event) => {
        let appPlayer = event.target;
        props.changePlayerTime(appPlayer.currentTime, appPlayer.duration);
    };

    
    const audioPlayerEnded = useCallback((event) => {
        let nextIndex = props.queueIndex + 1;
        if (props.queue && props.queue.length >= nextIndex) {
            props.nextTrackInQueue();
        } else {
            props.stopPlayer();
        }
    });

    const throttleTimeline = throttle(() => {
        if (!playerElement.paused) {
           updateTimeline(props.queue[props.queueIndex], playerActions.PlayState.PLAY_STATE_PLAYING, playerElement.currentTime, playerElement.duration);
        }
    }, 4000, {trailing: false});

    useEffect(() => {
        if (!playerElement) return;
        playerElement.addEventListener("timeupdate", throttleTimeline);
        return () => playerElement.removeEventListener("timeupdate", throttleTimeline);
    }, [props.queueId, props.queueIndex]);

    useEffect(() => {
        // No media to play
        if (props.queueIndex < 0 || props.queue.length === 0) return;

        //console.log("Track has changed", hasTrackChanged());
        if (hasTrackChanged()) {
            const playInfo = props.queue[props.queueIndex];
            const currentTrack = playInfo.Media[0];

            // Stop playback, if you change the source of the audio while
            // it's playing, there is an exception thrown in the console.
            if (props.playState === playerActions.PlayState.PLAY_STATE_PLAYING) {
                //console.log("STOP: Track is playing, pause and remove source.");
                stopTrack();
            }

            // Probably need to handle multiparts in some way? Even if it's just a warning?
            if (currentTrack.Part[0]) {
                //console.log("START: Add source and start playing.", currentTrack);
                const src = PlexApi.formatUrl(`${props.baseUrl}${currentTrack.Part[0].key}`, { "X-Plex-Token": props.authToken });

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
    }, [props.queueId, props.queueIndex]);

    return (
        <React.Fragment>
            <div className="flex flex-grow flex-wrap">
                <PlayerRangeControl playerRangeChanged={playerRangeChanged} />
                <div style={{flexBasis: "100%", height: "0" }}></div>
                <div className="flex flex-grow items-center justify-center mb-5">
                    <PreviousTrackControl />
                    <SkipBackControl skipBackward={skipBackward} />
                    <PlayPauseControl playTrack={playTrack} pauseTrack={pauseTrack}/>
                    <SkipForwardControl skipForward={skipForward} />
                    <NexTrackControl />
                </div>
            </div>
            <StopControl stopPlayer={stopPlayer} />
            <audio id="appPlayer" onTimeUpdate={timeUpdated} onEnded={audioPlayerEnded} />
        </React.Fragment>
    ); 
}

const AudioPlayer = connect(mapStateToProps, mapDispatchToProps)(ConnectedAudioPlayer);
export default AudioPlayer;