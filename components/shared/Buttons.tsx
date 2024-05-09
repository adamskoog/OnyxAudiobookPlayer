import { ReactNode } from 'react';
import Link from 'next/link';
import { Button as MaintineBtn } from '@mantine/core';

import { usePathname } from 'next/navigation'

import styles from './styles/Buttons.module.css'


type ButtonProps = {
    className?: string | undefined,
    disabled?: boolean | undefined,
    children: ReactNode,
    onClick?: () => void
}

type LinkButtonProps = {
    title: string,
    url: string
}

export function Button({ className, children, disabled = false, onClick }: ButtonProps) {

    const btnOnClick = () => {
        if (onClick) onClick();
    };

    let classes = [styles.btn];
    if (className) classes.push(className)

    return (
        <MaintineBtn className={classes.join(' ')} onClick={btnOnClick} disabled={disabled}>{children}</MaintineBtn>
    );
}

export function NavButton({ className, children, disabled = false, onClick }: ButtonProps) {

    let classes = [styles.nav];
    if (className) classes.push(className)

    return (
        <Button className={classes.join(' ')} onClick={onClick} disabled={disabled}>{children}</Button>
    );
}

export function NavLinkButton({ title, url }: LinkButtonProps) {

    const pathname = usePathname()

    let classes = [styles.btn, styles.nav]

    if (pathname) {
        if (url === '/') {
            if (pathname === '/' ) classes.push(styles.active)
        } else {
            if (pathname.startsWith(url)) classes.push(styles.active)
        }
    }

    return (
        <MaintineBtn className={classes.join(' ')} component={Link} href={url}>{title}</MaintineBtn>
    );
}

export default NavLinkButton