import React from 'react';
import styled from 'styled-components';
import PauseTrackSvg from '-!svg-react-loader!../../../assets/playerPause.svg';
import PlayTrackSvg from '-!svg-react-loader!../../../assets/playerPlay.svg';
import { useAppSelector } from '../../../context/hooks';

import { PlayState } from '../../../context/actions/playerActions';

const PlayerLargeButton = styled.button`
    margin-left: 0.5rem;
    margin-right: 0.5rem;
    font-size: 2.25rem;
    line-height: 2.5rem;
`;

type Props = {
    playTrack: () => void,
    pauseTrack: () => void
}

function PlayPauseControl({ playTrack, pauseTrack }: Props) {
  const playState = useAppSelector((state) => state.player.mode);

  return (
    <>
      {playState === PlayState.PLAY_STATE_PAUSED && (
      <PlayerLargeButton onClick={() => playTrack()}>
        <PauseTrackSvg />
      </PlayerLargeButton>
      )}
      {playState === PlayState.PLAY_STATE_PLAYING && (
      <PlayerLargeButton onClick={() => pauseTrack()}>
        <PlayTrackSvg />
      </PlayerLargeButton>
      )}
    </>
  );
}

export default PlayPauseControl;
