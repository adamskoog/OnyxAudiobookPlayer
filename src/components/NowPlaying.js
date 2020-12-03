import React, { useState, useEffect, useRef, useCallback } from 'react';
import PlexRequest from '../plex/PlexRequest';
import throttle from 'lodash/throttle';
import TimeUtils from '../utility/time';
import { Link } from 'react-router-dom';
import AlbumHelpers from '../plex/AlbumHelpers';
//https://stackoverflow.com/questions/46983876/pass-argument-to-lodash-throttles-callback

function NowPlaying(props) {

    //https://dev.to/ma5ly/lets-make-a-little-audio-player-in-react-p4p
    //https://stackoverflow.com/questions/47686345/playing-sound-in-reactjs

    const defaultTimeDisplay = "--:--/--:--";

    function usePrevious(value) {
        const ref = useRef();
        useEffect(() => {
          ref.current = value;
        });
        return ref.current;
    }

    const [playerTimeState, setPlayerTimeState] = useState({ currentTime: 0, duration: 0 });   
    const [queueIndex, setQueueIndex] = useState(-1);
    const [playState, setPlayState] = useState("stopped");
    const [currentTimeDisplay, setCurrentTimeDisplay] = useState(defaultTimeDisplay);

    const prevIndex = usePrevious(queueIndex);
    const prevQueue = usePrevious(props.playQueue);

    function hasTrackChanged() {
        // we need to do something here to check if the
        // track has been changed.
        if (prevQueue && prevQueue.id !== props.playQueue.id) return true;
        if (queueIndex !== prevIndex) return true;
        return false;
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
            duration: AlbumHelpers.timelineTrackDurationFlex(TimeUtils.convertSecondsToMs(duration)),
            "X-Plex-Token": props.userInfo.authToken
        };
        PlexRequest.updateTimeline(props.baseUrl, args)
            .then(data => { /*console.log("data", data); TODO: This doesn't seem to return anything, and errors out often.*/ });
    }

    // Event Handlers
    const throttleTimeline = throttle(() => {
        let appPlayer = document.getElementById("appPlayer");
        if (!appPlayer.paused) {
            updateTimeline(props.playQueue.queue[queueIndex], "playing", appPlayer.currentTime, appPlayer.duration);
            setPlayerTimeState({
                currentTime: appPlayer.currentTime,
                duration: appPlayer.duration
            });
        }
    }, 4000, {trailing: false});

    const updateTimeDisplay = useCallback((event) => {
        let currentTimeDisplay = TimeUtils.formatPlayerDisplay(event.target.currentTime, event.target.duration);
        setCurrentTimeDisplay(currentTimeDisplay);
    });

    const audioPlayerEnded = useCallback((event) => {
        let nextIndex = queueIndex++;
        if (props.playQueue && props.playQueue.queue && props.playQueue.queue[queueIndex]) {
            setQueueIndex(nextIndex);
        } else {
            setQueueIndex(-1);
            setPlayState("stopped");
        }
    });

    // Effects
    useEffect(() => {
        let appPlayer = document.getElementById("appPlayer");
        appPlayer.addEventListener("timeupdate", updateTimeDisplay);
        return () => appPlayer.removeEventListener("timeupdate", updateTimeDisplay);
    }, [updateTimeDisplay]);

    useEffect(() => {
        let appPlayer = document.getElementById("appPlayer");
        appPlayer.addEventListener("timeupdate", throttleTimeline);
        return () => appPlayer.removeEventListener("timeupdate", throttleTimeline);
    }, [props.playQueue]);

    useEffect(() => {
        let appPlayer = document.getElementById("appPlayer");
        appPlayer.addEventListener("ended", audioPlayerEnded);
        return () => appPlayer.removeEventListener("ended", audioPlayerEnded);
    }, [props.playQueue, audioPlayerEnded]);

    useEffect(() => {
        // No media to play
        if (queueIndex < 0 || props.playQueue.queue.length === 0) return;

        //console.log("Track has changed", hasTrackChanged());
        if (hasTrackChanged()) {
            const playInfo = props.playQueue.queue[queueIndex];
            const currentTrack = playInfo.Media[0];

            // Stop playback, if you change the source of the audio while
            // it's playing, there is an exception thrown in the console.
            if (playState === "playing") {
                //console.log("STOP: Track is playing, pause and remove source.");
                stopTrack();
            }

            // Probably need to handle multiparts in some way? Even if it's just a warning?
            if (currentTrack.Part[0]) {
                //console.log("START: Add source and start playing.", currentTrack);
                const src = PlexRequest.formatUrl(`${props.baseUrl}${currentTrack.Part[0].key}`, { "X-Plex-Token": props.userInfo.authToken });

                // get the reference to the audio tag.
                let appPlayer = document.getElementById("appPlayer");
                appPlayer.src = src;
                playTrack();
            }
        }
    }, [props.playQueue, queueIndex]);

    const playerRangeChanged = (evt) => {
        let appPlayer = document.getElementById("appPlayer");
        let range = document.getElementById("playerTimeRange");
        appPlayer.currentTime = range.value;
    };

    const playTrack = () => {
        let appPlayer = document.getElementById("appPlayer");
        appPlayer.play();
        setPlayState("playing"); 
    };

    const pauseTrack = () => {
        let appPlayer = document.getElementById("appPlayer");
        appPlayer.pause();
        updateTimeline(props.playQueue.queue[queueIndex], "paused", appPlayer.currentTime, appPlayer.duration);
        setPlayState("paused");     
    };

    const stopTrack = () => {
        let appPlayer = document.getElementById("appPlayer");
        appPlayer.pause();
        appPlayer.src = "";
        updateTimeline(props.playQueue.queue[queueIndex], "stopped", appPlayer.currentTime, appPlayer.duration);
        setPlayState("stopped"); 
        setQueueIndex(-1);
    };

    const skipForward = () => {
        let appPlayer = document.getElementById("appPlayer");
        let newTime = appPlayer.currentTime + 30;
        if (newTime < appPlayer.duration)
            appPlayer.currentTime = newTime;
        else 
            nextTrack();
    };

    const skipBackward = () => {
        let appPlayer = document.getElementById("appPlayer");
        let newTime = appPlayer.currentTime - 10;
        if (newTime > 0) {
            appPlayer.currentTime = newTime;
        } else {
            appPlayer.currentTime = 0;
        }
    };

    const hasPreviousTrack = () => {
        let newTrackIndex = queueIndex - 1;
        if (newTrackIndex >= 0) {
            return true;
        }
        return false;
    };

    const hasNextTrack = () => {
        let newTrackIndex = queueIndex + 1;
        if (newTrackIndex < props.playQueue.queue.length) {
            return true;
        }
        return false;
    };

    const previousTrack = () => {
        // TODO: in this case, the upcoming tracks will need the play status
        // reset so they start at the beginning of the track.

        let newTrackIndex = queueIndex - 1;
        if (hasPreviousTrack()) {
            setQueueIndex(newTrackIndex);
        }
    };

    const nextTrack = () => {
        // In this case, if the user is skipping a track, a timeline update should be done
        // so the track shows as completed to keep correct on deck position.
        
        let newTrackIndex = queueIndex + 1;
        if (hasNextTrack()) {
            setQueueIndex(newTrackIndex);
        }
    };

    // TODO: The time display needs to be pushed to a component, currently we are re-rending the
    // entire now playing component everytime the time updates, this should be pushed as a prop
    // so we (hopefully) only re-render that item.
    function getThumbnailUrl() {
        if (!props.playQueue || !props.playQueue.queue || !props.playQueue.queue[queueIndex]) return "";    //TODO: We need a generic not found image.
        return PlexRequest.getThumbnailUrl(props.baseUrl, props.playQueue.queue[queueIndex].thumb, { "X-Plex-Token": props.userInfo.authToken })
    };
    function getPlayInfoAttr(attr) {
        if (!props.playQueue || !props.playQueue.queue || !props.playQueue.queue[queueIndex]) return "";
        return props.playQueue.queue[queueIndex][attr];
    };
    
    return (
    <React.Fragment>
        {(playState === "playing" || playState === "paused")  && (
        <React.Fragment>
            <div className="navbar navbar-expand-md navbar-dark bg-dark fixed-bottom now-playing">
                <img className="album-thumb" src={getThumbnailUrl()} alt="album art" />
                <div className="album-info ml-3 mr-3">
                    <div className="track-title">{getPlayInfoAttr("title")}</div>
                    <div className="album-title"><Link to={`/album/${getPlayInfoAttr("parentRatingKey")}`}>{getPlayInfoAttr("parentTitle")}</Link></div>
                    <div className="artist-name">{getPlayInfoAttr("grandparentTitle")}</div>
                    <div className="player-timer">{currentTimeDisplay}</div>
                </div>
                <div className="player-controls">
                    <div className="range-container"><input id="playerTimeRange" type="range" className="form-control-range" min={0} max={((playerTimeState.duration) ? playerTimeState.duration : 0)} value={playerTimeState.currentTime} onChange={() => playerRangeChanged()} /></div>
                    <div>
                    {(playState === "playing" || playState === "paused") && (
                        <button className="btn btn-player-previous-track" type="button" disabled={!hasPreviousTrack()}  onClick={() => previousTrack()}>
                        <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-skip-start-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M4.5 3.5A.5.5 0 0 0 4 4v8a.5.5 0 0 0 1 0V4a.5.5 0 0 0-.5-.5z"/>
                            <path d="M4.903 8.697l6.364 3.692c.54.313 1.232-.066 1.232-.697V4.308c0-.63-.692-1.01-1.232-.696L4.903 7.304a.802.802 0 0 0 0 1.393z"/>
                        </svg>
                        </button>
                    )}
                    {(playState === "playing" || playState === "paused") && (
                        <button className="btn btn-player-skip-back" type="button" onClick={() => skipBackward()}>
                            <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-skip-backward-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M.5 3.5A.5.5 0 0 0 0 4v8a.5.5 0 0 0 1 0V4a.5.5 0 0 0-.5-.5z"/>
                                <path d="M.904 8.697l6.363 3.692c.54.313 1.233-.066 1.233-.697V4.308c0-.63-.692-1.01-1.233-.696L.904 7.304a.802.802 0 0 0 0 1.393z"/>
                                <path d="M8.404 8.697l6.363 3.692c.54.313 1.233-.066 1.233-.697V4.308c0-.63-.693-1.01-1.233-.696L8.404 7.304a.802.802 0 0 0 0 1.393z"/>
                            </svg>
                        </button>
                    )}
                    {playState === "paused" && (
                        <button className="btn btn-player-play" type="button" onClick={() => playTrack()}>
                            <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-x-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                <path fillRule="evenodd" d="m 12.654334,8.697 -6.3630006,3.692 c -0.54,0.313 -1.233,-0.066 -1.233,-0.697 V 4.308 c 0,-0.63 0.692,-1.01 1.233,-0.696 l 6.3630006,3.692 a 0.802,0.802 0 0 1 0,1.393 z"/>
                            </svg>
                        </button>
                    )}
                    {playState === "playing" && (
                        <button className="btn btn-player-pause" type="button" onClick={() => pauseTrack()}>
                            <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-x-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"/>
                            </svg>
                        </button>
                    )}
                    {(playState === "playing" || playState === "paused") && (
                        <button className="btn btn-player-skip-forward" type="button" onClick={() => skipForward()}>
                            <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-skip-forward-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M15.5 3.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5z"/>
                                <path d="M7.596 8.697l-6.363 3.692C.693 12.702 0 12.322 0 11.692V4.308c0-.63.693-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
                                <path d="M15.096 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.693-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
                            </svg>
                        </button>
                    )}
                    {(playState === "playing" || playState === "paused") && (
                        <button className="btn btn-player-next-track" type="button" disabled={!hasNextTrack()} onClick={() => nextTrack()}>
                        <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-skip-end-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M12 3.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5z"/>
                            <path d="M11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
                        </svg>
                        </button>
                    )}
                    </div>
                </div>
                {(playState === "playing" || playState === "paused")  && (
                <div className="ml-auto">
                    <button className="btn btn-player-stop" type="button" onClick={() => stopTrack()}>
                        <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-x-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                            <path fillRule="evenodd" d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                        </svg>
                    </button>
                </div>
                )}
            </div>
        </React.Fragment>
        )}
        <audio id="appPlayer" />
    </React.Fragment>
    );
}

export default NowPlaying;
