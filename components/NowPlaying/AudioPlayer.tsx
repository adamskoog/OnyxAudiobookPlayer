import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import { setPlayerTime, clearPlayQueue, changePlayerMode, nextTrack } from '@/store/features/playerSlice';

import PlexJavascriptApi from '@/plex';
import type { PlexTrack } from '@/types/plex.types';
import type { PlayerMode } from '@/store/features/playerSlice';

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
import useAudioPlayer from './hooks/useAudioplayer';

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

    // console.log("updateTimeline ARGS", args);

    PlexJavascriptApi.updateTimeline(args)
        .then((data) => { 
            /* console.log("data", data); TODO: This doesn't seem to return anything, and errors out often. */ 
    });
};

function AudioPlayer() {

    const dispatch = useAppDispatch();

    const view = useAppSelector(state => state.player.view);

    const currentTrack = useAppSelector(state => state.player.currentTrack);
    const isLastTrack = useAppSelector(state => state.player.isLastTrack);

    const skipBackwardIncrement = useAppSelector(state => state.player.skipBackwardIncrement);
    const skipForwardIncrement = useAppSelector(state => state.player.skipForwardIncrement);

    const prevTrack: PlexTrack | null = usePrevious(currentTrack);

    const { mode, timeline, playerTime, play, pause, stop, skipBackward, skipForward, setTrack, setTime } = useAudioPlayer({ skipBackwardTime: skipBackwardIncrement, skipForwardTime: skipForwardIncrement});

    useEffect(() => {
        if (!playerTime) return;
        dispatch(setPlayerTime({ current: playerTime.time, duration: playerTime.duration}));
    }, [playerTime])

    useEffect(() => {

        if (!currentTrack || !timeline) return;
        if (currentTrack.ratingKey !== prevTrack?.ratingKey) return;

        // Check if we have ended to break out of timelines.
        if (timeline.state === 'ended') {
            // If we've ended we need to check for next track and do a full timeline stop.
            updateTimeline(currentTrack, 'stopped', currentTrack.duration, currentTrack.duration);
            
            if (!isLastTrack) {
                dispatch(nextTrack());
            } else {
                dispatch(clearPlayQueue());
            }

            return;
        }

        // Do we have a current time, if not we can't update the timeline.
        if (isNaN(timeline.time)) return; 

        // Check if the player has loaded fully to get the duration yet 
        // if not, use the track duration.
        let duration = timeline.duration;
        if (isNaN(duration)) {
            duration = convertMsToSeconds(currentTrack.duration);
        }

        // We are not ended - do a normal timeline update based on player values.
        // console.log("timeline event", timeline, duration)
        updateTimeline(currentTrack, timeline.state, timeline.time, duration);

        if (timeline.state === 'stopped') {
            // The player has been stopped - clear the play queue
            // console.log("track stopped - clearing queue.")
            dispatch(clearPlayQueue());
        }
    }, [currentTrack, timeline])

    useEffect(() => {
        dispatch(changePlayerMode(mode));
    }, [mode])

    useEffect(() => {
        // No media to play
        if (!currentTrack) return;

        if (currentTrack.ratingKey !== prevTrack?.ratingKey) {
          const trackMedia = currentTrack.Media[0];
       
          const src = PlexJavascriptApi.getTrackMediaUrl(trackMedia);
          if (!src) {
            console.error('Failed to find source for track:', currentTrack.ratingKey);
            return;
          }

          setTrack(src, currentTrack.viewOffset ? convertMsToSeconds(currentTrack.viewOffset) : 0);
        }
    }, [currentTrack]);

    let classes = [styles.container];
    if (view === 'maximized') classes.push(styles.maximized);
    return (
        <div className={classes.join(' ')}>
            <RangeControl playerRangeChanged={setTime} />
            <div className={`${styles.controls}`}>
                <PreviousTrackControl />
                <SkipBackControl skipBackward={skipBackward} />
                <PlayPauseControl pauseTrack={pause} playTrack={play} />
                <SkipForwardControl skipForward={skipForward} />
                <NexTrackControl />
                <StopControl stop={stop} />
            </div>
        </div>
    );
}

export default AudioPlayer;