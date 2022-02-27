import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

import TimeUtils from '../../../utility/time';

const TimeDisplay = styled.div``;

const defaultTimeDisplay = "--:--/--:--";
const formatTime = (currentTime, duration) => {
    if (!currentTime && !duration)
        return defaultTimeDisplay;
    return TimeUtils.formatPlayerDisplay(currentTime, duration);
};

const PlayerTime = () => {    
    const currentTime = useSelector(state => state.player.currentTime);
    const duration = useSelector(state => state.player.duration);

    return (
        <TimeDisplay>{formatTime(currentTime, duration)}</TimeDisplay>
    ); 
}

export default PlayerTime;