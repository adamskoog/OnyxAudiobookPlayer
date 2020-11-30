import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PlexRequest from '../plex/PlexRequest';
import throttle from 'lodash/throttle';
import TimeUtils from '../utility/time';
import { Link } from 'react-router-dom';
import AlbumHelpers from '../plex/AlbumHelpers';
//https://stackoverflow.com/questions/46983876/pass-argument-to-lodash-throttles-callback

class NowPlaying extends Component {

    //https://dev.to/ma5ly/lets-make-a-little-audio-player-in-react-p4p
    //https://stackoverflow.com/questions/47686345/playing-sound-in-reactjs
    state = {
        baseUrl: this.props.baseUrl,
        userInfo: this.props.userInfo,
        playInfo: null,
        playQueue: [],
        previousQueue: [],
        player: "stopped",
        currentTime: 0,
        currentTimeDisplay: "",
        duration: 0,
        updateTimeline: false
    }

    updatePlayInfo = (baseUrl, userInfo, playQueue) => {
        let nextTrack = playQueue.shift();
        this.setState({ baseUrl: baseUrl, userInfo: userInfo, playInfo: nextTrack, playQueue: playQueue }, () => {
            if (nextTrack) {
                let offset = (nextTrack && nextTrack.viewOffset) ? TimeUtils.convertMsToSeconds(nextTrack.viewOffset) : 0;
                this.player.currentTime = offset;
            }
        });
    }

    componentDidMount() {
        // Perhaps the time on this needs some tuning, what does Plex use?
        this.player.addEventListener("timeupdate", throttle(() => {
            if (this.state.player === "playing")
                this.setState({ currentTime: this.player.currentTime, duration: this.player.duration, updateTimeline: true });
        }, 4000, {trailing: false}), false);

        // Seperate unthrottled update to handle the UI updates.
        this.player.addEventListener("timeupdate", () => {
            let currentTimeDisplay = TimeUtils.formatPlayerDisplay(this.player.currentTime, this.player.duration);
            this.setState({ currentTimeDisplay: currentTimeDisplay, updateTimeline: false });
        });

        this.player.addEventListener("ended", () => {
            let nextTrack = this.state.playQueue.shift();
            if (nextTrack)
                this.setState({ playInfo: nextTrack, playQueue: this.state.playQueue });
            else
                this.setState({ playInfo: null, playQueue: [] }); 
        });
    };
    
    componentDidUpdate(prevProps, prevState) {
        // No media to play
        if (!this.state.playInfo) return;

        let previousId = null;
        if (prevState && prevState.playInfo) {
            previousId = prevState.playInfo.Media[0].id;
        }

        let currentTrack = this.state.playInfo.Media[0];
        if (currentTrack.id !== previousId) {
            // Stop playback, if you change the source of the audio while
            // it's playing, there is an exception thrown in the console.
            if (previousId && (this.state.player !== "paused" || this.state.player !== "stopped")) {
                //console.log("stopping track");
                this.stopTrack();
            }

            if (currentTrack.Part[0]) {
                let src = PlexRequest.formatUrl(`${this.state.baseUrl}${currentTrack.Part[0].key}`, { "X-Plex-Token": this.state.userInfo.authToken });
                this.player.src = src;
                //console.log("start new track");
                this.playTrack();
            }
        }
        
        if (this.state.updateTimeline === true) {
            // Here we need to do our timeline updates back to plex.
            if (this.state.player === "playing") {
                //console.log("Track is playing", this.state.currentTime);
                this.updateTimeline(this.state.player);
            } else if (prevState.player === "playing" && this.state.player === "paused") {
                //console.log("Track has been paused, update timeline state", this.state.currentTime);
                this.updateTimeline(this.state.player);
            } else if ((prevState.player === "playing" || prevState.player === "paused") && this.state.player === "stopped") {
                //console.log("Track has been stopped, update timeline state", this.state.currentTime);
                this.updateTimeline(this.state.player);
                this.setState({ playInfo: null });
            }
        }
    }

    playTrack = () => {
        this.player.play();
        this.setState({player: "playing" });      
    }

    pauseTrack = () => {
        this.player.pause();
        this.setState({player: "paused", updateTimeline: true });      
    }

    skipForward = () => {
        let newTime = this.player.currentTime + 30;
        if (newTime < this.player.duration) {
            this.player.currentTime = newTime;
        } else {
            this.nextTrack();
        }
    }

    skipBackward = () => {
        let newTime = this.player.currentTime - 10;
        if (newTime > 0) {
            this.player.currentTime = newTime;
        } else {
            this.player.currentTime = 0;
        }
    }

    previousTrack = () => {
        // TODO: in this case, the upcoming tracks will need the play status
        // reset so they start at the beginning of the track.

        let nextTracks = this.state.playQueue;
        nextTracks.unshift(this.state.playInfo);
        
        let nextTrack = this.state.previousQueue.pop();
        if (nextTrack)
            this.setState({ previousQueue: this.state.previousQueue, playInfo: nextTrack, playQueue: nextTracks });
        else
            this.setState({ previousQueue: [], playInfo: null, playQueue: [] }); 
    }

    nextTrack = () => {
        // In this case, if the user is skipping a track, a timeline update should be done
        // so the track shows as completed to keep correct on deck position.
        
        let previousTracks = this.state.previousQueue;
        previousTracks.push(this.state.playInfo);
        
        let nextTrack = this.state.playQueue.shift();
        if (nextTrack)
            this.setState({ previousQueue: previousTracks, playInfo: nextTrack, playQueue: this.state.playQueue });
        else
            this.setState({ previousQueue: [], playInfo: null, playQueue: [] }); 
    }

    stopTrack = () => {
        this.player.pause();
        this.setState({ player: "stopped", updateTimeline: true });
    }

    playerRangeChanged = () => {
        this.player.currentTime = this.playerRange.value;
        this.setState({ currentTime: this.player.currentTime });
    }

    updateTimeline = (state) => {
        // we need a way to update the album info if the user is looking at the album
        // page, It should keep the on deck updated.
        // Should this be done while playing, or only when user pauses/kills the stream.
        let args = {
            ratingKey: this.state.playInfo.ratingKey,
            key: this.state.playInfo.key,
            state: state,
            time: TimeUtils.convertSecondsToMs(this.state.currentTime),
            playbackTime: TimeUtils.convertSecondsToMs(this.state.currentTime),
            duration: AlbumHelpers.timelineTrackDurationFlex(TimeUtils.convertSecondsToMs(this.state.duration)),
            "X-Plex-Token": this.state.userInfo.authToken
        };
        PlexRequest.updateTimeline(this.state.baseUrl, args)
            .then(data => { /*console.log("data", data); TODO: This doesn't seem to return anything, and errors out often.*/ });
    }

    render() {
        return (
        <React.Fragment>
            {(this.state.player === "playing" || this.state.player === "paused")  && (
                <React.Fragment>
                    <div className="navbar navbar-expand-md navbar-dark bg-dark fixed-bottom now-playing">
                        <img className="album-thumb" src={PlexRequest.getThumbnailUrl(this.state.baseUrl, this.state.playInfo.thumb, { "X-Plex-Token": this.state.userInfo.authToken })} alt="album" />
                        <div className="album-info ml-3 mr-3">
                            <div className="track-title">{this.state.playInfo.title}</div>
                            <div className="album-title"><Link to={`/album/${this.state.playInfo.parentRatingKey}`}>{this.state.playInfo.parentTitle}</Link></div>
                            <div className="artist-name">{this.state.playInfo.grandparentTitle}</div>
                            <div className="player-timer">{this.state.currentTimeDisplay}</div>
                        </div>
                        <div className="player-controls">
                        <div className="range-container"><input type="range" className="form-control-range" ref={ref => this.playerRange = ref} min={0} max={((this.state.duration) ? this.state.duration : 0)} value={this.state.currentTime} onChange={() => this.playerRangeChanged()} /></div>
                        <div>
                        {(this.state.player === "playing" || this.state.player === "paused") && (
                            <button className="btn btn-player-previous-track" type="button" disabled={(this.state.previousQueue.length === 0) ? true : false}  onClick={() => this.previousTrack()}>
                            <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-skip-start-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M4.5 3.5A.5.5 0 0 0 4 4v8a.5.5 0 0 0 1 0V4a.5.5 0 0 0-.5-.5z"/>
                                <path d="M4.903 8.697l6.364 3.692c.54.313 1.232-.066 1.232-.697V4.308c0-.63-.692-1.01-1.232-.696L4.903 7.304a.802.802 0 0 0 0 1.393z"/>
                            </svg>
                            </button>
                        )}
                        {(this.state.player === "playing" || this.state.player === "paused") && (
                            <button className="btn btn-player-skip-back" type="button" onClick={() => this.skipBackward()}>
                                <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-skip-backward-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M.5 3.5A.5.5 0 0 0 0 4v8a.5.5 0 0 0 1 0V4a.5.5 0 0 0-.5-.5z"/>
                                    <path d="M.904 8.697l6.363 3.692c.54.313 1.233-.066 1.233-.697V4.308c0-.63-.692-1.01-1.233-.696L.904 7.304a.802.802 0 0 0 0 1.393z"/>
                                    <path d="M8.404 8.697l6.363 3.692c.54.313 1.233-.066 1.233-.697V4.308c0-.63-.693-1.01-1.233-.696L8.404 7.304a.802.802 0 0 0 0 1.393z"/>
                                </svg>
                            </button>
                        )}
                        {this.state.player === "paused" && (
                            <button className="btn btn-player-play" type="button" onClick={() => this.playTrack()}>
                                <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-x-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                    <path fillRule="evenodd" d="m 12.654334,8.697 -6.3630006,3.692 c -0.54,0.313 -1.233,-0.066 -1.233,-0.697 V 4.308 c 0,-0.63 0.692,-1.01 1.233,-0.696 l 6.3630006,3.692 a 0.802,0.802 0 0 1 0,1.393 z"/>
                                </svg>
                            </button>
                        )}
                        {this.state.player === "playing" && (
                            <button className="btn btn-player-pause" type="button" onClick={() => this.pauseTrack()}>
                                <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-x-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                    <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"/>
                                </svg>
                            </button>
                        )}
                        {(this.state.player === "playing" || this.state.player === "paused") && (
                            <button className="btn btn-player-skip-forward" type="button" onClick={() => this.skipForward()}>
                                <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-skip-forward-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M15.5 3.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5z"/>
                                    <path d="M7.596 8.697l-6.363 3.692C.693 12.702 0 12.322 0 11.692V4.308c0-.63.693-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
                                    <path d="M15.096 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.693-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
                                </svg>
                            </button>
                        )}
                        {(this.state.player === "playing" || this.state.player === "paused") && (
                            <button className="btn btn-player-next-track" type="button" disabled={(this.state.playQueue.length === 0) ? true : false} onClick={() => this.nextTrack()}>
                            <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-skip-end-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M12 3.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5z"/>
                                <path d="M11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
                            </svg>
                            </button>
                        )}
                        </div>
                        </div>
                        {(this.state.player === "playing" || this.state.player === "paused")  && (
                            <div className="ml-auto">
                                <button className="btn btn-player-stop" type="button" onClick={() => this.stopTrack()}>
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
                    
            <audio ref={ref => this.player = ref} />
        </React.Fragment>
        ); 
    }
}

NowPlaying.propTypes = {
    baseUrl: PropTypes.string
}

export default NowPlaying;
