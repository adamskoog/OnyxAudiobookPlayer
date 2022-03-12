import React from 'react';
import styled from 'styled-components';

import { ReactComponent as SkipForwardSvg } from '../../../assets/playerSkipForward.svg';

// TODO: refactor to shared
const PlayerSmallButton = styled.button`
    margin-left: 0.5rem;
    margin-right: 0.5rem;

    font-size: 1.5rem;
    line-height: 2rem;
`;

const SkipForwardControl = (props) => {

    const SKIP_TIME = 30;
    const skipForward = () => {
        props.skipForward(SKIP_TIME);
    };

    return (
        <PlayerSmallButton onClick={() => skipForward()}>
            <SkipForwardSvg />
        </PlayerSmallButton>
    ); 
}

export default SkipForwardControl;