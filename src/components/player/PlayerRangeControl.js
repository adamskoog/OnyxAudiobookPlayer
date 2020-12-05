import React from 'react';

function PlayerRangeControl(props) {

    return (
        <div className="range-container">
            <input id="playerTimeRange" 
                type="range" 
                className="form-control-range" 
                min={0} 
                max={props.duration} 
                value={props.currentTime} 
                onChange={() => props.onChange()} 
                />
        </div>
    ); 
}

export default PlayerRangeControl;