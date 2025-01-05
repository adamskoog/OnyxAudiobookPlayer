import { useEffect, useState, useRef } from "react";
import throttle from 'lodash/throttle';

type HookProps = {
    playbackSpeed?: number | undefined,
    skipForwardTime?: number | undefined,
    skipBackwardTime?: number | undefined,
    throttleDuration?: number | undefined
}

type HookReturn = {
    mode: PlayerModes, 
    getPosition: () => TimeEvent,
    timeline: TimelineEvent | null, 
    playerTime: TimeEvent | null, 
    play: () => void, 
    pause: () => void, 
    stop: () => void, 
    skipBackward: () => void, 
    skipForward: () => void, 
    setTrack: (track: string, time: number) => void, 
    setTime: (time: number) => void
}

export type PlayerModes = 'stopped' | 'playing' | 'paused' | 'ended';

export type TimeEvent = {
    time: number,
    duration: number,
    rate: number,
}

export type TimelineEvent = {
    state: PlayerModes,
    time: number,
    duration: number,
    rate: number,
}

const useAudioPlayer = ({ 
    playbackSpeed = 1.0, 
    skipForwardTime = 30, 
    skipBackwardTime = 10, 
    throttleDuration = 20000
}: HookProps): HookReturn => {
    
    const audioplayerRef = useRef(new Audio());
    audioplayerRef.current.playbackRate = playbackSpeed;

    const [mode, setMode] = useState<PlayerModes>('stopped');
    const [playerTime, setPlayerTime] = useState<TimeEvent | null>(null);
    const [timeline, setTimeline] = useState<TimelineEvent | null>(null);

    const getPosition = (): TimeEvent => {
        const element = audioplayerRef.current;
        return { time: element.currentTime, duration: element.duration, rate: element.playbackRate }
    }

    const setTrack = (track: string, time: number): void => {
        const element = audioplayerRef.current;

        // Set the track and the current time.
        element.src = track;
        element.currentTime = time;
    };

    const setTime = (time: number): void => {

        const element = audioplayerRef.current;
        element.currentTime = time;

        setTimeline({ state: mode, time: element.currentTime, duration: element.duration, rate: element.playbackRate });
    };

    const play = (): void => {
        const element = audioplayerRef.current;

        element.play();
        setTimeline({ state: 'playing', time: element.currentTime, duration: element.duration, rate: element.playbackRate });

        setMode('playing');
    };

    const pause = (): void => {
        const element = audioplayerRef.current;

        element.pause();
        setTimeline({ state: 'paused', time: element.currentTime, duration: element.duration, rate: element.playbackRate });

        setMode('paused');
    };

    const stop = (): void => {
        const element = audioplayerRef.current;

        element.pause();
        setTimeline({ state: 'stopped', time: element.currentTime, duration: element.duration, rate: element.playbackRate });
        element.src = '';

        setMode('stopped');
    };

    const skipBackward = (): void => {
        const element = audioplayerRef.current;

        let time = element.currentTime - skipBackwardTime;
        if (time < 0) time = 0;
        element.currentTime = time;
    };

    const skipForward = (): void => {
        const element = audioplayerRef.current;

        let time = element.currentTime + skipForwardTime;
        if (time > element.duration) time = element.duration;
        element.currentTime = time;
    };

    const onCanPlay = () => {
        const element = audioplayerRef.current;
        if (mode === 'playing') {
            // We are already playing (likely do to a track change). 
            // Start the player.
            element.play();
            return;
        }

        // Play the track.
        play();
    }

    //TODO: should we only be giving the actual timeline updates from the
    // player vs throttling this internally? Or should this be handled by the
    // logic we use to interact with plex??
    // Update - Tested removing this out to the player using the playerTime - wasn't able
    // to get the throttling working correctly and passing the correct values. Revist later.
    const throttleTimeline = throttle(() => {
        const element = audioplayerRef.current;
        if (!element.paused) {
            setTimeline({ state: 'playing', time: element.currentTime, duration: element.duration, rate: element.playbackRate });
        }
    }, throttleDuration, { 'leading': true, 'trailing': false });

    const onTimeUpdated = () => {
        const element = audioplayerRef.current;

        setPlayerTime({ time: element.currentTime, duration: element.duration, rate: element.playbackRate });

        throttleTimeline();
    };

    const onEnded = () => {
        const element = audioplayerRef.current;

        element.pause();
        setTimeline({ state: 'ended', time: element.duration, duration: element.duration, rate: element.playbackRate });
        element.src = '';

        setMode('ended');
    };

    // TODO: adding for future usage. Need to find a way to reliably
    // test this state.
    const onError = (err: any) => {
        // console.error("error", err);

        setMode("stopped");
    };
    
    const onAborted = () => {
        // console.error("aborted");

        setMode("stopped");
    };

    useEffect(() => {
        // Handle the mode state change and update player to reflect.
        const element = audioplayerRef.current;

        // Set up our event listeners.
        element.addEventListener('canplay', onCanPlay);
        element.addEventListener('timeupdate', onTimeUpdated);
        element.addEventListener('ended', onEnded);
        element.addEventListener('error', onError);
        element.addEventListener('abort', onAborted);

        return () => {
            element.removeEventListener('canplay', onCanPlay);
            element.removeEventListener('timeupdate', onTimeUpdated);
            element.removeEventListener('ended', onEnded);
            element.removeEventListener('error', onError);
            element.removeEventListener('abort', onAborted);
        }
   }, []);

   return { 
        mode,
        timeline,
        getPosition,
        playerTime,
        play,
        pause,
        stop,
        skipBackward,
        skipForward,
        setTrack,
        setTime,
    };
}

export default useAudioPlayer;