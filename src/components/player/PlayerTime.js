import React from 'react';
import { connect } from 'react-redux';
import TimeUtils from '../../utility/time';

const mapStateToProps = state => {
    return { 
        currentTime: state.player.currentTime,
        duration: state.player.duration
    };
};

function ConnectedPlayerTime(props) {
    const defaultTimeDisplay = "--:--/--:--";
    
    function formatTime () {
        if (!props.currentTime && !props.duration)
            return defaultTimeDisplay;
        return TimeUtils.formatPlayerDisplay(props.currentTime, props.duration);
    }

    return (
        <div className="player-timer">{formatTime()}</div>
    ); 
}

const PlayerTime = connect(mapStateToProps)(ConnectedPlayerTime);
export default PlayerTime;