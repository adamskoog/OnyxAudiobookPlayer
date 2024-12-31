
type Props = {
    play: () => void,
    pause: () => void,
    skipBackward: () => void,
    skipForward: () => void,
    stop: () => void,
    meta: MediaMetadata | undefined
};

export default function useMediaSession(props: Props) {

    if (props.meta) navigator.mediaSession.metadata = props.meta;

    // Check if mediaSession is supported.
    if ("mediaSession" in navigator) {
        navigator.mediaSession.setActionHandler('play', async () => { props.play(); });
        navigator.mediaSession.setActionHandler('pause', () => { props.pause(); });
        navigator.mediaSession.setActionHandler('seekbackward', () => { props.skipBackward() });
        navigator.mediaSession.setActionHandler('seekforward', () => { props.skipForward() });

        try {
            // The stop action is relatively new - need to catch if it fails.
            navigator.mediaSession.setActionHandler('stop', function() {
                props.stop();
            });
        } catch(error) { }
    }
};