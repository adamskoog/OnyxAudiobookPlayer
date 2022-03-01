import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

const PlayerRangeInput = styled.input`
    margin: .75rem 1rem;
    flex-grow: 1;
`;

const checkValid = (value) => {
    if (!value || isNaN(value)) return 0;
    return value;
}

const PlayerRangeControl = ({ playerRangeChanged }) => {

    const currentTime = useSelector(state => state.player.currentTime);
    const duration = useSelector(state => state.player.duration);
    
    return (
        <PlayerRangeInput type="range" min={0}  max={checkValid(duration)} 
            value={checkValid(currentTime)}  onChange={playerRangeChanged} />
    ); 
}

export default PlayerRangeControl;