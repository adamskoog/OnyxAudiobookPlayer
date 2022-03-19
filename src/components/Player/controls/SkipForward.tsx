import React, { ReactElement } from 'react';
import styled from 'styled-components';

import SkipForwardSvg from '-!svg-react-loader!../../../assets/playerSkipForward.svg';

// TODO: refactor to shared
const PlayerSmallButton = styled.button`
    margin-left: 0.5rem;
    margin-right: 0.5rem;

    font-size: 1.5rem;
    line-height: 2rem;
`;

type Props = {
    skipForward: (skipTime: number) => void
}

function SkipForwardControl({ skipForward }: Props): ReactElement {
  const SKIP_TIME = 30;

  return (
    <PlayerSmallButton onClick={() => skipForward(SKIP_TIME)}>
      <SkipForwardSvg />
    </PlayerSmallButton>
  );
}

export default SkipForwardControl;
