import React from 'react';
import styled from 'styled-components';
import { useAppSelector } from '../../../context/hooks';

import { formatPlayerDisplay } from '../../../utility/time';

const TimeDisplay = styled.div``;

const defaultTimeDisplay = '--:--/--:--';

const formatTime = (currentTime: any, duration: any) => {
  if (!currentTime && !duration) return defaultTimeDisplay;
  return formatPlayerDisplay(currentTime, duration);
};

function PlayerTime() {
  const currentTime = useAppSelector((state) => state.player.currentTime);
  const duration = useAppSelector((state) => state.player.duration);

  return (
    <TimeDisplay>{formatTime(currentTime, duration)}</TimeDisplay>
  );
}

export default PlayerTime;
