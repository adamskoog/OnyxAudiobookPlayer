import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import PlexApi from '../../plex/Api';

import { Link } from 'react-router-dom';
import PlayerTime from './controls/PlayerTime';
import AudioPlayer from './Player';

import * as playerActions from "../../context/actions/playerActions";

const mapStateToProps = state => {
    return { 
        authToken: state.application.authToken,
        baseUrl: state.application.baseUrl,
        playState: state.player.mode,
        currentTrack: state.playQueue.currentTrack
    };
};
function ConnectedNowPlaying(props) {

    function getThumbnailUrl() {
        if (!props.currentTrack) return "";
        return PlexApi.getThumbnailTranscodeUrl(100, 100, props.baseUrl, props.currentTrack.thumb, props.authToken);
    };

    function getPlayInfoAttr(attr) {
        if (!props.currentTrack) return "";
        return props.currentTrack[attr];
    };
    
    useEffect(() => {
        const elem = document.querySelector(".now-playing");
        if (elem && (props.playState === playerActions.PlayState.PLAY_STATE_PLAYING || props.playState === playerActions.PlayState.PLAY_STATE_PAUSED)) {
            elem.classList.remove("hidden");
        } else {
            elem.classList.add("hidden");
        }
    }, [props.playState]);

    return (
        <div className="navbar navbar-expand-md navbar-dark bg-dark fixed-bottom now-playing">
            <img className="album-thumb" src={getThumbnailUrl()} alt="album art" />
            <div className="album-info ml-3 mr-3">
                <div className="track-title">{getPlayInfoAttr("title")}</div>
                <div className="album-title"><Link to={`/album/${getPlayInfoAttr("parentRatingKey")}`}>{getPlayInfoAttr("parentTitle")}</Link></div>
                <div className="artist-name">{getPlayInfoAttr("grandparentTitle")}</div>
                <PlayerTime />
            </div>
            <AudioPlayer />
        </div>
    );
}

const NowPlaying = connect(mapStateToProps)(ConnectedNowPlaying);
export default NowPlaying;
