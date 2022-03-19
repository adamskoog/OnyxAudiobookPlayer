import React from 'react';
import styled from 'styled-components';

import SkipBackSvg from '-!svg-react-loader!../../../assets/playerSkipBack.svg';

// TODO: refactor to shared
const PlayerSmallButton = styled.button`
    margin-left: 0.5rem;
    margin-right: 0.5rem;

    font-size: 1.5rem;
    line-height: 2rem;
`;

type Props = {
    skipBackward: (skipBack: number) => void
}

function SkipBackControl({ skipBackward }: Props) {
  const SKIP_TIME = 10;
  return (
    <PlayerSmallButton onClick={() => skipBackward(SKIP_TIME)}>
      <SkipBackSvg />
    </PlayerSmallButton>
  );
}

export default SkipBackControl;
