import React, { ReactElement } from 'react';
import styled from 'styled-components';

import PreviousTrackSvg from '-!svg-react-loader!../../../assets/playerPreviousTrack.svg';
import { useAppSelector, useAppDispatch } from '../../../context/hooks';
import { previousTrackInQueue } from '../../../context/actions/playQueueActions';

// TODO: refactor to shared
const PlayerSmallButton = styled.button`
    margin-left: 0.5rem;
    margin-right: 0.5rem;

    font-size: 1.5rem;
    line-height: 2rem;
`;

const hasPreviousTrack = (queueIndex: number): boolean => {
  const newTrackIndex = queueIndex - 1;
  if (newTrackIndex >= 0) {
    return true;
  }
  return false;
};

function PreviousTrackControl(): ReactElement {
  const dispatch = useAppDispatch();

  const queueIndex = useAppSelector((state) => state.playQueue.index);

  return (
    <PlayerSmallButton disabled={!hasPreviousTrack(queueIndex)} onClick={() => dispatch(previousTrackInQueue())}>
      <PreviousTrackSvg />
    </PlayerSmallButton>
  );
}

export default PreviousTrackControl;
