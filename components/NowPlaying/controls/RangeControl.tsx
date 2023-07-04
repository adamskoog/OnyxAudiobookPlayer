import { Slider } from '@mantine/core';
import { useAppSelector } from '@/store';
import { formatProgressLabel } from '@/utility';
import styles from './styles/Controls.module.css'

// TODO: need to figure out where/when this might not be a number.
const checkValid = (value: number | null): number => {
  if (!value || Number.isNaN(value)) return 0;
  return value;
};

type Props = {
    playerRangeChanged: (value: number) => void
}

function RangeControl({ playerRangeChanged }: Props) {
    const currentTime = useAppSelector((state) => state.player.currentTime);
    const duration = useAppSelector((state) => state.player.duration);

  return (
    <Slider 
        title={'Track Location'}
        className={`${styles.range}`}
        thumbSize={16}
        label={value => formatProgressLabel(value)} 
        min={0} 
        max={checkValid(duration)} 
        value={checkValid(currentTime)} 
        onChange={playerRangeChanged} 
    />
  );
}

export default RangeControl;
