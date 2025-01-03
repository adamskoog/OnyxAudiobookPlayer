import { useEffect, useState, useRef, useCallback } from "react";
import throttle from 'lodash/throttle';

type HookProps = {
    skipForwardTime?: number | undefined,
    skipBackwardTime?: number | undefined,
    throttleDuration?: number | undefined
}

export type PlayerModes = 'stopped' | 'playing' | 'paused' | 'ended';

export type TimeEvent = {
    time: number,
    duration: number
}

type TimelineEvent = {
    state: PlayerModes,
    time: number,
    duration: number
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

const useAudioPlayer = ({ skipForwardTime = 30, skipBackwardTime = 10, throttleDuration = 20000}: HookProps): HookReturn => {
    
    const audioplayerRef = useRef(new Audio());

    const [mode, setMode] = useState<PlayerModes>('stopped')
    const [playerTime, setPlayerTime] = useState<TimeEvent | null>(null)
    const [timeline, setTimeline] = useState<TimelineEvent | null>(null)

    const onTimeUpdated = () => {
        const element = audioplayerRef.current;

        setPlayerTime({ time: element.currentTime, duration: element.duration });
    };
   
    const getPosition = () => {
        const element = audioplayerRef.current;
        return { time: element.currentTime, duration: element.duration }
    }
    
    //TODO: should we only be giving the actual timeline updates from the
    // player vs throttling this internally? Or should this be handled by the
    // logic we use to interact with plex??
    // Update - Tested removing this out to the player using the playerTime - wasn't able
    // to get the throttling working correctly and passing the correct values. Revist later.
    const throttleTimeline = throttle(() => {
        const element = audioplayerRef.current;
        if (!element.paused) {
            setTimeline({ state: 'playing', time: element.currentTime, duration: element.duration });
        }
    }, throttleDuration, { 'leading': true, 'trailing': false });

    const setTrack = useCallback((track: string, time: number): void => {
        const element = audioplayerRef.current;

        // Set the track and the current time.
        element.src = track;
        element.currentTime = time;

        if (mode === 'playing') {
            // We are already playing (likely do to a track change). 
            // Start the player.
            element.play();
            return;
        }

        // Play the track.
        play();
    }, [mode]);

    const setTime = useCallback((time: number): void => {

        const element = audioplayerRef.current;
        element.currentTime = time;

        setTimeline({ state: mode, time: element.currentTime, duration: element.duration });
    }, [mode]);

    const play = useCallback((): void => {
        setMode('playing');
    }, []);

    const pause = useCallback((): void => {
        setMode('paused');
    }, []);

    const stop = useCallback((): void => {
        setMode('stopped');
    }, []);

    const skipBackward = useCallback((): void => {
        const element = audioplayerRef.current;

        let time = element.currentTime - skipBackwardTime;
        if (time < 0) time = 0;
        element.currentTime = time;
    }, [skipBackwardTime]);

    const skipForward = useCallback((): void => {
        const element = audioplayerRef.current;

        let time = element.currentTime + skipForwardTime;
        if (time > element.duration) time = element.duration;
        element.currentTime = time;
    }, [skipBackwardTime]);

    const onEnded = () => {
        setMode('ended');
    }

    useEffect(() => {
        // Handle the mode state change and update player to reflect.
        const element = audioplayerRef.current;

        // Set up our event listeners.
        element.addEventListener('timeupdate', throttleTimeline);
        element.addEventListener('timeupdate', onTimeUpdated);
        element.addEventListener('ended', onEnded);

        if (mode === 'playing') {
            element.play();
            setTimeline({ state: 'playing', time: element.currentTime, duration: element.duration });
        } else if (mode === 'paused') {
            element.pause();
            setTimeline({ state: 'paused', time: element.currentTime, duration: element.duration });
        } else if (mode === 'stopped') {
            element.pause();
            setTimeline({ state: 'stopped', time: element.currentTime, duration: element.duration });
            element.src = '';
        } else if (mode === 'ended') {
            element.pause();
            setTimeline({ state: 'ended', time: element.duration, duration: element.duration });
            element.src = '';
        }

        return () => {
            element.removeEventListener('timeupdate', throttleTimeline);
            element.removeEventListener('timeupdate', onTimeUpdated);
            element.removeEventListener('ended', onEnded);
        }
   }, [mode])

   return { mode, getPosition, timeline, playerTime, play, pause, stop, skipBackward, skipForward, setTrack, setTime }
}

export default useAudioPlayer;