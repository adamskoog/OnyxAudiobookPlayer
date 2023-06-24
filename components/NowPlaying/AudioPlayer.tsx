import { useEffect, useRef, useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import { setPlayerTime, clearPlayQueue, changePlayerMode, nextTrack } from '@/store/features/playerSlice';

import PlexJavascriptApi from '@/plex';
import type { PlexTrack } from '@/types/plex.types';
import type { PlayerMode } from '@/store/features/playerSlice';

import throttle from 'lodash/throttle';
import { convertSecondsToMs, convertMsToSeconds } from '@/utility';

import { usePrevious } from '@/hooks';
import styles from './styles/AudioPlayer.module.css'

import {
    PreviousTrackControl,
    SkipBackControl,
    PlayPauseControl,
    SkipForwardControl,
    NexTrackControl,
    StopControl,
    RangeControl
} from './controls'

const updateTimeline = (track: PlexTrack, playerState: PlayerMode, currentTime: number, duration: number): void => {

    // When track first starts we don't immediately have a time sometimes, this can lead
    // to bad data passed to plex and marking the track played.
    if (isNaN(duration)) return;

    // TODO: We need a way to update the album info if the user is looking at the album
    // page, It should keep the on deck updated.
    const args = {
      ratingKey: track.ratingKey,
      key: track.key,
      state: playerState,
      time: convertSecondsToMs(currentTime),
      playbackTime: convertSecondsToMs(currentTime),
      duration: convertSecondsToMs(duration),
    };

    PlexJavascriptApi.updateTimeline(args)
        .then((data) => { 
            /* console.log("data", data); TODO: This doesn't seem to return anything, and errors out often. */ 
    });
};

function AudioPlayer() {

    const dispatch = useAppDispatch();

    const queueId = useAppSelector(state => state.player.queueId);
    const queueIndex = useAppSelector((state) => state.player.queueIndex);
    const queue = useAppSelector(state => state.player.queue);
    // const playState = useAppSelector((state) => state.player.mode);

    const prevIndex: number = usePrevious(queueIndex);
    const prevQueue: string = usePrevious(queueId);
    const playerRef = useRef<HTMLAudioElement | null>(null);

    const hasTrackChanged = (): boolean => {
        // Check our previous Refs to see if we have changed tracks.
        if (prevQueue !== queueId) return true;
        if (prevIndex !== queueIndex) return true;
        return false;
    };

    const timeUpdated = (event: React.ChangeEvent<HTMLAudioElement>): void => {
        dispatch(setPlayerTime({ current: event.target.currentTime, duration: event.target.duration}));
    };

    const audioPlayerEnded = useCallback((): void => {
        const nextIndex = queueIndex + 1;
        updateTimeline(queue[queueIndex], 'stopped', queue[queueIndex].duration, queue[queueIndex].duration);
        
        if (queue && queue.length > nextIndex) {
            dispatch(nextTrack());
        } else {
            stopPlayer();
        }
    }, [queueIndex, queue]);

    const playerRangeChanged = (evt: React.ChangeEvent<HTMLInputElement>): void => {
        const playerElement = playerRef.current;
        if (playerElement) {
            playerElement.currentTime = parseInt(evt.target.value);
        }
    };

    const playTrack = (): void => {
        const playerElement = playerRef.current;
        if (playerElement) {
            playerElement.play();
            dispatch(changePlayerMode('playing'))
        }
    };

    const pauseTrack = (): void => {
        const playerElement = playerRef.current;
        if (playerElement) {
            playerElement.pause();
        
            updateTimeline(queue[queueIndex], 'paused', playerElement.currentTime, playerElement.duration);
            dispatch(changePlayerMode('paused'))
        }
    };

    const skipBackward = (): void => {
        const playerElement = playerRef.current;
        if (playerElement) {
            let newTime = playerElement.currentTime - 10;
            if (newTime < 0) newTime = 0;
            playerElement.currentTime = newTime;
        }
    };

    const skipForward = (): void => {
        const playerElement = playerRef.current;
        if (playerElement) {
            let newTime = playerElement.currentTime + 30;
            if (newTime > playerElement.duration) newTime = playerElement.duration;
            playerElement.currentTime = newTime;
        }
    };

    const stopTrack = (): void => {
        const playerElement = playerRef.current;
        if (playerElement) {
            playerElement.pause();
        
            updateTimeline(queue[queueIndex], 'stopped', playerElement.currentTime, playerElement.duration);
            dispatch(changePlayerMode('stopped'))
    
            playerElement.src = '';
        }
    };

    const stopPlayer = (): void => {
        stopTrack();
        dispatch(clearPlayQueue());
    };

    useEffect(() => {
        const playerElement = playerRef.current;
        if (!playerElement) return;

        const throttleTimeline = throttle(() => {
            if (!playerElement.paused) {
                updateTimeline(queue[queueIndex], 'playing', playerElement.currentTime, playerElement.duration);
            }
        }, 20000, { trailing: false });

        playerElement.addEventListener('timeupdate', throttleTimeline);
        return () => playerElement.removeEventListener('timeupdate', throttleTimeline);
    }, [queueId, queueIndex]);

    useEffect(() => {
        // No media to play
        if (queueIndex < 0 || queue.length === 0) return;
    
        // console.log("Track has changed", hasTrackChanged());
        if (hasTrackChanged()) {
          const playInfo = queue[queueIndex];
          const currentTrack = playInfo.Media[0];
    
          // Stop playback, if you change the source of the audio while
          // it's playing, there is an exception thrown in the console.
        //   TODO: Verify - but this doesn't seem to cause a problem anymore,
        //          and is actually making extraneous calls when active.
        //   if (playState === 'playing') {
        //     // console.log("STOP: Track is playing, pause and remove source.");
        //     console.log("need stop?")
        //     stopTrack();
        //   }
    
          // Probably need to handle multiparts in some way? Even if it's just a warning?
          if (currentTrack.Part[0]) {
            // console.log("START: Add source and start playing.", currentTrack);
            const src = PlexJavascriptApi.getTrackMediaUrl(currentTrack);
    
            // get the reference to the audio tag.
            const playerElement = playerRef.current;
            if (playerElement) {
                playerElement.src = src;
                playerElement.currentTime = 0;
                if (playInfo.viewOffset) {
                // Check if we have a viewOffset, if so set the offset to the players time.
                playerElement.currentTime = convertMsToSeconds(playInfo.viewOffset);
                }
                playTrack();
            }
          }
        }
    }, [queueId, queueIndex]);

    return (
        <div className={`${styles.container}`}>
            <RangeControl playerRangeChanged={playerRangeChanged} />
            <div className={`${styles.controls}`}>
                <PreviousTrackControl />
                <SkipBackControl skipBackward={skipBackward} />
                <PlayPauseControl pauseTrack={pauseTrack} playTrack={playTrack} />
                <SkipForwardControl skipForward={skipForward} />
                <NexTrackControl />
                <StopControl stop={stopPlayer} />
            </div>
            <audio ref={playerRef} onTimeUpdate={timeUpdated} onEnded={audioPlayerEnded} />
        </div>
    );
}

export default AudioPlayer;