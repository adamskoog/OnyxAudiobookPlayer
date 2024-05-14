'use client'
import { useState } from 'react';
import { Badge, Switch as MantineSwitch } from '@mantine/core';

import { loadSettingFromStorage, saveSettingToStorage, FEATURE_FLAG } from '@/utility';

import styles from './styles/Settings.module.css'

type Props = {
    isBeta: boolean,
    label: string,
    storageKey: string
}

function Switch({ label, storageKey, isBeta = false }: Props) {

    const [value, setValue] = useState(loadSettingFromStorage(storageKey));

    const onChange = (checked: boolean) => {
        const tmp = checked ? FEATURE_FLAG.ON: FEATURE_FLAG.OFF;

        // Update the local storage setting
        saveSettingToStorage(storageKey, tmp);

        // update state.
        setValue(tmp);
    }

    const Beta = <Badge color="indigo">Beta</Badge>;

    return (
        <div className={`${styles.switchContainer}`}>
            <span className={`${styles.label}`}>{isBeta && Beta} {label}</span>
            <MantineSwitch
                className={`${styles.switch}`}
                size="lg"
                labelPosition="left"
                onLabel="ON" offLabel="OFF"
                checked={value === "1"}
                onChange={(event) => onChange(event.currentTarget.checked)}
            />
        </div>
    )
}

export default Switch;