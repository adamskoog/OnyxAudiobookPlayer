import { useAppSelector } from '@/store'
import { UnstyledButton } from '@mantine/core';
import Link from 'next/link';

import styles from './styles/Activity.module.css'
import ActivityIcon from '@/assets/peaks.svg'

function Activity() {

    const mode = useAppSelector((state) => state.player.mode);
    const appState = useAppSelector((state) => state.application.state);

    if (appState === 'loading' || mode === 'stopped') return <div className={`${styles.activity}`}></div>
    return (
        <UnstyledButton className={`${styles.activity}`} component={Link} href={'/nowplaying'}>
            <ActivityIcon alt={'Now Playing'} />
        </UnstyledButton>
    );
}

export default Activity;