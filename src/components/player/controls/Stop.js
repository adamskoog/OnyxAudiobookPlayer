import React from 'react';
import styled from 'styled-components';

import { ReactComponent as StopTrackSvg } from '../../../assets/playerStop.svg';

const PlayerStopButton = styled.button`
    font-size: 1.25rem;
    line-height: 1.75rem;

    padding-right: .75rem;
`;

const StopControl = ({ stopPlayer }) => {

    return (
        <PlayerStopButton onClick={() => stopPlayer()}>
            <StopTrackSvg />
        </PlayerStopButton>
    ); 
}

export default StopControl;