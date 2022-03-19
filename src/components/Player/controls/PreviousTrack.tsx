import React from 'react';
import styled from 'styled-components';

import { useAppSelector, useAppDispatch } from '../../../context/hooks';
import { previousTrackInQueue } from "../../../context/actions/playQueueActions";
import PreviousTrackSvg from '-!svg-react-loader!../../../assets/playerPreviousTrack.svg';

// TODO: refactor to shared
const PlayerSmallButton = styled.button`
    margin-left: 0.5rem;
    margin-right: 0.5rem;

    font-size: 1.5rem;
    line-height: 2rem;
`;

const hasPreviousTrack = (queueIndex: number): boolean => {
    let newTrackIndex = queueIndex - 1;
    if (newTrackIndex >= 0) {
        return true;
    }
    return false;
};

const PreviousTrackControl = () => {
    const dispatch = useAppDispatch();

    const queueIndex = useAppSelector(state => state.playQueue.index);

    return (
        <PlayerSmallButton disabled={!hasPreviousTrack(queueIndex)}  onClick={() => dispatch(previousTrackInQueue())}>
            <PreviousTrackSvg />
        </PlayerSmallButton>
    ); 
}

export default PreviousTrackControl;