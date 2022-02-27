
import React from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';

import { nextTrackInQueue } from "../../../context/actions/playQueueActions";
import { ReactComponent as NextTrackSvg } from '../../../assets/playerNextTrack.svg';

// TODO: refactor to shared
const PlayerSmallButton = styled.button`
    margin-left: 0.5rem;
    margin-right: 0.5rem;

    font-size: 1.5rem;
    line-height: 2rem;
`;

const hasNextTrack = (queueIndex, queue) => {       
    let newTrackIndex = queueIndex + 1;
    if (newTrackIndex < queue.length) {
        return true;
    }
    return false;
};

const NexTrackControl = () => {
    const dispatch = useDispatch();

    const queueIndex = useSelector(state => state.playQueue.index);
    const queue = useSelector(state => state.playQueue.queue);

    return (
        <>
            <PlayerSmallButton disabled={!hasNextTrack(queueIndex, queue)} onClick={() => dispatch(nextTrackInQueue())}>
                <NextTrackSvg />
            </PlayerSmallButton>
        </>
    ); 
}

export default NexTrackControl;