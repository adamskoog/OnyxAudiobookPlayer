import { memo } from 'react';
import { Slider } from '@mantine/core';
import { useAppSelector, RootState } from '@/store';
import { formatProgressLabel } from '@/utility';
import styles from './styles/Controls.module.css'
import { createSelector } from '@reduxjs/toolkit';

// TODO: need to figure out where/when this might not be a number.
const checkValid = (value: number | null): number => {
  if (!value || Number.isNaN(value)) return 0;
  return value;
};

type Props = {
    playerRangeChanged: (value: number) => void
}

function RangeControl({ playerRangeChanged }: Props) {

    const timeData = useAppSelector(createSelector([
        (state: RootState) => state.player.currentTime,
        (state: RootState) => state.player.duration
    ],
      (currentTime, duration): {
        currentTime: number| null,
        duration: number| null
      } => { return { currentTime, duration } }
    ));

  return (
    <Slider 
        title={'Track Location'}
        className={`${styles.range}`}
        thumbSize={16}
        label={value => formatProgressLabel(value)} 
        min={0} 
        max={checkValid(timeData.duration)} 
        value={checkValid(timeData.currentTime)} 
        onChange={playerRangeChanged} 
    />
  );
}

export default memo(RangeControl);
