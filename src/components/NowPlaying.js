import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import PlexRequest from '../plex/PlexRequest';

import { Link } from 'react-router-dom';
import PlayerTime from './player/PlayerTime';
import AudioPlayer from './player/Player';

import * as playerActions from "../context/actions/playerActions";

const mapStateToProps = state => {
    return { 
        authToken: state.application.authToken,
        baseUrl: state.application.baseUrl,
        queue: state.playQueue.queue,
        queueIndex: state.playQueue.index,
        playState: state.player.mode
    };
};
function ConnectedNowPlaying(props) {

    function getThumbnailUrl() {
        if (!props.queue || !props.queue[props.queueIndex]) return "";    //TODO: We need a generic not found image.
        return PlexRequest.getThumbnailTranscodeUrl(100, 100, props.baseUrl, props.queue[props.queueIndex].thumb, props.authToken);
    };

    function getPlayInfoAttr(attr) {
        if (!props.queue || !props.queue[props.queueIndex]) return "";
        return props.queue[props.queueIndex][attr];
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
