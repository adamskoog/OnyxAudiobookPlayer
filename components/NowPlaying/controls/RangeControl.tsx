import { useAppSelector } from '@/store';

import styles from './styles/Controls.module.css'

// TODO: need to figure out where/when this might not be a number.
const checkValid = (value: number | any): number => {
  if (!value || Number.isNaN(value)) return 0;
  return value;
};

type Props = {
    playerRangeChanged: (evt: React.ChangeEvent<HTMLInputElement>) => void
}

function RangeControl({ playerRangeChanged }: Props) {
    const currentTime = useAppSelector((state) => state.player.currentTime);
    const duration = useAppSelector((state) => state.player.duration);

  return (
    <input className={`${styles.range}`}
      type="range"
      min={0}
      max={checkValid(duration)}
      value={checkValid(currentTime)}
      onChange={playerRangeChanged}
    />
  );
}

export default RangeControl;
