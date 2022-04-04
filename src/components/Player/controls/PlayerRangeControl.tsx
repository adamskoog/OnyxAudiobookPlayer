import React, { ReactElement } from 'react';
import styled from 'styled-components';
import { useAppSelector } from '../../../context/hooks';

const PlayerRangeInput = styled.input`
    margin: .75rem 1rem;
    flex-grow: 1;
`;

// TODO: need to figure out where/when this might not be a number.
const checkValid = (value: number | any): number => {
  if (!value || Number.isNaN(value)) return 0;
  return value;
};

type Props = {
    playerRangeChanged: (evt: React.ChangeEvent<HTMLInputElement>) => void
}

function PlayerRangeControl({ playerRangeChanged }: Props): ReactElement {
  const currentTime = useAppSelector((state) => state.player.currentTime);
  const duration = useAppSelector((state) => state.player.duration);

  return (
    <PlayerRangeInput
      type="range"
      min={0}
      max={checkValid(duration)}
      value={checkValid(currentTime)}
      onChange={playerRangeChanged}
    />
  );
}

export default PlayerRangeControl;
