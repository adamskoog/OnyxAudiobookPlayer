import React from 'react';
import { connect } from 'react-redux';

import * as playerActions from "../../../context/actions/playerActions";

const mapStateToProps = state => {
    return { 
        playState: state.player.mode
    };
};

function ConnectedPlayPauseControl(props) {

    return (
        <React.Fragment>
        {props.playState === playerActions.PlayState.PLAY_STATE_PAUSED && (
            <button className="btn btn-player-play" type="button" onClick={() => props.playTrack()}>
                <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-x-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                    <path fillRule="evenodd" d="m 12.654334,8.697 -6.3630006,3.692 c -0.54,0.313 -1.233,-0.066 -1.233,-0.697 V 4.308 c 0,-0.63 0.692,-1.01 1.233,-0.696 l 6.3630006,3.692 a 0.802,0.802 0 0 1 0,1.393 z"/>
                </svg>
            </button>
        )}
        {props.playState === playerActions.PlayState.PLAY_STATE_PLAYING && (
            <button className="btn btn-player-pause" type="button" onClick={() => props.pauseTrack()}>
                <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-x-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                    <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"/>
                </svg>
            </button>
        )}
        </React.Fragment>
    ); 
}

const PlayPauseControl = connect(mapStateToProps)(ConnectedPlayPauseControl);
export default PlayPauseControl;