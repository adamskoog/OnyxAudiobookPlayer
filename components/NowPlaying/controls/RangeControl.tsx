import { memo, useState } from 'react';
import { Slider } from '@mantine/core';

import { useAppSelector } from '@/store';
import { formatProgressLabel } from '@/utility';

import styles from './styles/Controls.module.css';

// TODO: need to figure out where/when this might not be a number.
const checkValid = (value: number | null): number => {
    if (!value || Number.isNaN(value)) return 0;
    return value;
};

type Props = {
    playerRangeChanged: (value: number) => void
};

function RangeControl({ playerRangeChanged }: Props) {

    const [value, setValue] = useState<number | null>(null);

    const currentTime = useAppSelector(state => state.player.currentTime);
    const duration = useAppSelector(state => state.player.duration);

    const onChange = (value: number) => {
        // Set a local state value so we can update the value
        // of the slider and see the timestamp without an actual change.
        setValue(value);
    }

    const onChangeEnd = (value: number) => {
        // call the range changed to update the player in the store.
        playerRangeChanged(value);

        // set our local state to null so we again use
        // the redux store value.
        setValue(null);
    }

    return (
        <Slider 
            title={'Track Location'}
            className={`${styles.range}`}
            thumbSize={16}
            label={value => formatProgressLabel(value)} 
            min={0} 
            max={checkValid(duration)} 
            value={checkValid(value || currentTime)}
            onChange={onChange}
            onChangeEnd={onChangeEnd}
        />
    );
};

export default memo(RangeControl);
