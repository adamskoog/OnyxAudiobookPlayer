import React from 'react';
import styled from 'styled-components';

import { ReactComponent as SkipBackSvg } from '../../../assets/playerSkipBack.svg';

// TODO: refactor to shared
const PlayerSmallButton = styled.button`
    margin-left: 0.5rem;
    margin-right: 0.5rem;

    font-size: 1.5rem;
    line-height: 2rem;
`;

const SkipBackControl = (props) => {

    // TODO: make a setting and pull from state.
    const SKIP_TIME = 10;
    const skipBackward = () => {
        props.skipBackward(SKIP_TIME);
    };

    return (
        <PlayerSmallButton onClick={() => skipBackward()}>
            <SkipBackSvg />
        </PlayerSmallButton>
    ); 
}

export default SkipBackControl;