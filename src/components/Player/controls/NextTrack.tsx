import React, { ReactElement } from 'react';
import styled from 'styled-components';

import NextTrackSvg from '-!svg-react-loader!../../../assets/playerNextTrack.svg';
import { useAppSelector, useAppDispatch } from '../../../context/hooks';

import { nextTrackInQueue } from '../../../context/actions/playQueueActions';

// TODO: refactor to shared
const PlayerSmallButton = styled.button`
    margin-left: 0.5rem;
    margin-right: 0.5rem;

    font-size: 1.5rem;
    line-height: 2rem;
`;

const hasNextTrack = (queueIndex: number, queue: Array<PlexTrack>): boolean => {
  const newTrackIndex = queueIndex + 1;
  if (newTrackIndex < queue.length) {
    return true;
  }
  return false;
};

function NexTrackControl(): ReactElement {
  const dispatch = useAppDispatch();

  const queueIndex = useAppSelector((state) => state.playQueue.index);
  const queue = useAppSelector((state) => state.playQueue.queue);

  return (
    <PlayerSmallButton disabled={!hasNextTrack(queueIndex, queue)} onClick={() => dispatch(nextTrackInQueue())}>
      <NextTrackSvg />
    </PlayerSmallButton>
  );
}

export default NexTrackControl;
