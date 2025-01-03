import { PlayerModes, TimeEvent } from "./useAudioplayer";

type Props = {
    play: MediaSessionActionHandler | null,
    pause: MediaSessionActionHandler | null,
    skipBackward: MediaSessionActionHandler | null,
    skipForward: MediaSessionActionHandler | null,
    previousTrackHandler: MediaSessionActionHandler | null,
    nextTrackHandler: MediaSessionActionHandler | null,
    stop: MediaSessionActionHandler | null,
    meta: MediaMetadata | null;
    mode: PlayerModes
};

type ReturnType = {
    updateSessionTime: (time: TimeEvent | null) => void
}

export default function useMediaSession(props: Props): ReturnType {
    
    function updateSessionTime(evt: TimeEvent | null) {
        if (evt && 'setPositionState' in navigator.mediaSession) {
            try {
                navigator.mediaSession.setPositionState({
                    duration: evt.duration,
                    playbackRate: 1,
                    position: evt.time,
                });
            } catch {
                // avoid error when duration is not ready.
            }
        }
    }

    // Check if mediaSession is supported.
    if ("mediaSession" in navigator && props.meta) {

        navigator.mediaSession.metadata = props.meta;

        if (props.mode === 'playing' || props.mode === 'paused') 
            navigator.mediaSession.playbackState = props.mode;

        navigator.mediaSession.setActionHandler('play', props.play);
        navigator.mediaSession.setActionHandler('pause', props.pause);
        navigator.mediaSession.setActionHandler('seekbackward', props.skipBackward);
        navigator.mediaSession.setActionHandler('seekforward', props.skipForward);
        navigator.mediaSession.setActionHandler('nexttrack', props.nextTrackHandler);
        navigator.mediaSession.setActionHandler('previoustrack', props.previousTrackHandler);

        try {
            // The stop action is relatively new - need to catch if it fails.
            navigator.mediaSession.setActionHandler('stop', props.stop);
        } catch(error) { }
    }

    return { updateSessionTime };
};