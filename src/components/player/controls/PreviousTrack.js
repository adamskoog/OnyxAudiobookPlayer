import React from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';

import { previousTrackInQueue } from "../../../context/actions/playQueueActions";
import { ReactComponent as PreviousTrackSvg } from '../../../assets/playerPreviousTrack.svg';

// TODO: refactor to shared
const PlayerSmallButton = styled.button`
    margin-left: 0.5rem;
    margin-right: 0.5rem;

    font-size: 1.5rem;
    line-height: 2rem;
`;

const hasPreviousTrack = (queueIndex) => {
    let newTrackIndex = queueIndex - 1;
    if (newTrackIndex >= 0) {
        return true;
    }
    return false;
};

function PreviousTrackControl() {
    const dispatch = useDispatch();

    const queueIndex = useSelector(state => state.playQueue.index);

    return (
        <PlayerSmallButton disabled={!hasPreviousTrack(queueIndex)}  onClick={() => dispatch(previousTrackInQueue())}>
            <PreviousTrackSvg />
        </PlayerSmallButton>
    ); 
}

export default PreviousTrackControl;