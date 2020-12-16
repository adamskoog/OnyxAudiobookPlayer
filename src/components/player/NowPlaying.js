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
        const main = document.querySelector(".main-viewer");
        const player = document.querySelector(".now-playing");
        if (props.playState === "stopped") {
            main.classList.remove("playing");
            player.classList.remove("playing");
        } else {
            main.classList.add("playing");
            player.classList.add("playing");
        }
    }, [props.playState]);

    return (
        <div className="bg-gray-800 text-white now-playing">
            <div className="flex flex-row flex-nowrap">
                <img className="album-thumb inline-block" src={getThumbnailUrl()} alt="album art" />
                <div className="inline-block ml-3 mr-3">
                    <div className="truncate">{getPlayInfoAttr("title")}</div>
                    <div className="text-gray-300 truncate"><Link to={`/album/${getPlayInfoAttr("parentRatingKey")}`}>{getPlayInfoAttr("parentTitle")}</Link></div>
                    <div className="text-gray-300 truncate">{getPlayInfoAttr("grandparentTitle")}</div>
                    <PlayerTime />
                </div>
                <AudioPlayer />
            </div>
        </div>
    );
}

const NowPlaying = connect(mapStateToProps)(ConnectedNowPlaying);
export default NowPlaying;
