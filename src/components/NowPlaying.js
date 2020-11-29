import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PlexRequest from '../plex/PlexRequest';
import throttle from 'lodash/throttle';
import TimeUtils from '../utility/time';
import { Link } from 'react-router-dom';
//https://stackoverflow.com/questions/46983876/pass-argument-to-lodash-throttles-callback

class NowPlaying extends Component {

    //https://dev.to/ma5ly/lets-make-a-little-audio-player-in-react-p4p
    //https://stackoverflow.com/questions/47686345/playing-sound-in-reactjs
    state = {
        baseUrl: this.props.baseUrl,
        userInfo: this.props.userInfo,
        playInfo: null,
        player: "stopped",
        currentTime: 0,
        currentTimeDisplay: "",
        duration: 0,
        updateTimeline: false
    }

    updatePlayInfo = (baseUrl, userInfo, playInfo) => {
        this.setState({ baseUrl: baseUrl, userInfo: userInfo, playInfo: playInfo }, () => {
            if (playInfo) {
                let offset = (playInfo && playInfo.viewOffset) ? TimeUtils.convertMsToSeconds(playInfo.viewOffset) : 0;
                this.player.currentTime = offset;
            }
        });
    }

    componentDidMount() {
        // Perhaps the time on this needs some tuning, what does Plex use?
        this.player.addEventListener("timeupdate", throttle(() => {
            if (this.state.player === "playing")
                this.setState({ currentTime: this.player.currentTime, duration: this.player.duration, updateTimeline: true });
        }, 2000, {trailing: false}), false);

        // Seperate unthrottled update to handle the UI updates.
        this.player.addEventListener("timeupdate", () => {
            let currentTimeDisplay = TimeUtils.formatPlayerDisplay(this.player.currentTime, this.player.duration);
            this.setState({ currentTimeDisplay: currentTimeDisplay, updateTimeline: false });
        });
    };
    
    componentDidUpdate(prevProps, prevState) {
        // No media to play
        //console.log("state updated", prevState, this.state);
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
            duration: TimeUtils.convertSecondsToMs(this.state.duration),
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
                        {this.state.player === "paused" && (
                            <div>
                                <button className="btn btn-player-play" type="button" onClick={() => this.playTrack()}>
                                    <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-x-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                        <path fillRule="evenodd" d="m 12.654334,8.697 -6.3630006,3.692 c -0.54,0.313 -1.233,-0.066 -1.233,-0.697 V 4.308 c 0,-0.63 0.692,-1.01 1.233,-0.696 l 6.3630006,3.692 a 0.802,0.802 0 0 1 0,1.393 z"/>
                                    </svg>
                                </button>
                            </div>
                        )}
                        {this.state.player === "playing" && (
                            <div>
                                <button className="btn btn-player-pause" type="button" onClick={() => this.pauseTrack()}>
                                    <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-x-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                        <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"/>
                                    </svg>
                                </button>
                            </div>
                        )}
                        <div className="range-container"><input type="range" className="form-control-range" ref={ref => this.playerRange = ref} min={0} max={((this.state.duration) ? this.state.duration : 0)} value={this.state.currentTime} onChange={() => this.playerRangeChanged()} /></div>
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
