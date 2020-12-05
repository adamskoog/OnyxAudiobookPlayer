import React from 'react';

function PlayerRangeControl(props) {

    const playerRangeChanged = (evt) => {
        props.onChange(evt);
    };

    return (
        <div className="range-container">
            <input id="playerTimeRange" 
                type="range" 
                className="form-control-range" 
                min={0} 
                max={props.duration} 
                value={props.currentTime} 
                onChange={playerRangeChanged} 
                />
        </div>
    ); 
}

export default PlayerRangeControl;