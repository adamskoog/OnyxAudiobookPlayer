import { RootState, useAppSelector } from '@/store';
import { formatPlayerDisplay } from '@/utility';
import { createSelector } from '@reduxjs/toolkit';

const defaultTimeDisplay = '--:--/--:--';

const formatTime = (currentTime: number | null, duration: number | null): string => {
  if (!currentTime || !duration) return defaultTimeDisplay;
  return formatPlayerDisplay(currentTime, duration);
};

function PlayerTime() {

  const { currentTime, duration } = useAppSelector(createSelector([
      (state: RootState) => state.player.currentTime,
      (state: RootState) => state.player.duration
    ],
      (currentTime, duration): {
        currentTime: number| null,
        duration: number| null
      } => { return { currentTime, duration } }
    ));

    return (
        <>{formatTime(currentTime, duration)}</>
    );
}

export default PlayerTime;
