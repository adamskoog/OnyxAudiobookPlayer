import React from 'react';
import { connect } from 'react-redux';

const mapStateToProps = state => {
    return { 
        currentTime: state.player.currentTime,
        duration: state.player.duration
    };
};

function ConnectedPlayerRangeControl(props) {

    function checkValid(value) {
        if (!value || isNaN(value)) return 0;
        return value;
    }

    return (
        <div className="flex flex-grow mx-5 mt-4 mb-2">
            <input id="playerTimeRange" 
                type="range" 
                className="flex-grow" 
                min={0} 
                max={checkValid(props.duration)} 
                value={checkValid(props.currentTime)} 
                onChange={props.playerRangeChanged} 
                />
        </div>
    ); 
}

const PlayerRangeControl = connect(mapStateToProps)(ConnectedPlayerRangeControl);
export default PlayerRangeControl;