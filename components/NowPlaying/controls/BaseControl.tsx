import { ReactNode } from 'react';
import { ActionIcon } from '@mantine/core';
import { useAppSelector } from '@/store'

import styles from './styles/Controls.module.css'

type ControlProps = {
    className?: string | undefined,
    title: string,
    disabled?: boolean,
    onClick: () => void,
    children: ReactNode
}

function BaseControl({ title, className, onClick, disabled = false, children }: ControlProps) {

    const mode = useAppSelector(state => state.player.mode)
    const view = useAppSelector(state => state.player.view)

    let classes = [styles.control];
    if (className) classes.push(className);
    if (mode !== 'stopped') {
        classes.push(styles.show);
        if (view === 'maximized') classes.push(styles.maximized);
    }

    const internalOnClick = () => {
        if (onClick) onClick();
    }

    return (
        <ActionIcon className={classes.join(' ')} title={title} disabled={disabled} onClick={internalOnClick} variant="transparent" color="dark">
            {children}
        </ActionIcon>
    );
}

export default BaseControl;
