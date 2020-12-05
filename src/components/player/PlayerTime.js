import React from 'react';

function PlayerTime(props) {

    return (
        <div className="player-timer">{props.currentTimeDisplay}</div>
    ); 
}

export default PlayerTime;