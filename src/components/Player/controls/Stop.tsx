import React from 'react';
import styled from 'styled-components';

import StopTrackSvg from '-!svg-react-loader!../../../assets/playerStop.svg';

const PlayerStopButton = styled.button`
    font-size: 1.25rem;
    line-height: 1.75rem;

    padding-right: .75rem;
`;

type Props = {
    stopPlayer: () => void
}

const StopControl = ({ stopPlayer }: Props) => {

    return (
        <PlayerStopButton onClick={stopPlayer}>
            <StopTrackSvg />
        </PlayerStopButton>
    ); 
}

export default StopControl;