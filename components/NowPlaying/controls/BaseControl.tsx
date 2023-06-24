import { ReactNode } from 'react';
import { ActionIcon } from '@mantine/core';

import styles from './styles/Controls.module.css'

type ControlProps = {
    className?: string | undefined,
    title: string,
    disabled?: boolean,
    onClick: () => void,
    children: ReactNode
}

function BaseControl({ title, className, onClick, disabled = false, children }: ControlProps) {

    let classes = [styles.control];
    if (className) classes.push(className);

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
