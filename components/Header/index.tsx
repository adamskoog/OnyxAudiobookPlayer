'use client'

import { Burger, Transition } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import { useAppSelector } from '@/store'

import UserInfo from './UserInfo'
import Activity from './Activity';
import { NavLinkButton } from '@/components/shared/Buttons';
import { useOutsideClick } from '@/hooks';

import { removeSettingFromStorage, SETTINGS_KEYS } from '@/utility';

import type { PlexUser } from '@/types/plex.types';

import styles from './styles/Header.module.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

type NavigationItemsProps = {
    user: PlexUser | null
}

function NavigationItems({ user }: NavigationItemsProps) {

    const navOnClick = () => {
        // on nav click, clear the library scroll position.
        sessionStorage.removeItem('libraryScrollPosition');
    };

    return (
        <>
        <NavLinkButton title={'Home'} url={'/'} onClick={navOnClick} />

        {/* Hide buttons when user is not logged in as they will not have access. */}
        {user && (
            <>
            <NavLinkButton title={'Library'} url={'/library'} onClick={navOnClick} />
            <NavLinkButton title={'Settings'} url={'/settings'} onClick={navOnClick} />
            </>
        )}
        </>
    )
}

function Header() {

    const user = useAppSelector((state) => state.application.user);

    const [opened, { close, toggle }] = useDisclosure(false);
    const ref = useOutsideClick(() => close());

    const label = opened ? 'Close navigation' : 'Open navigation';

    return (
        <nav className={`${styles.outer} ${inter.className}`}>
            <div className={`${styles.inner}`}>

                <Burger ref={ref} className={`${styles.burger}`} opened={opened} onClick={toggle} aria-label={label} color={'#fff'} />

                <div className={`${styles.title}`}>{'Onyx'}</div>

                <div className={`${styles.navigation}`}>
                    <NavigationItems user={user} />
                </div>

                <div className={`${styles.right}`}>
                    <Activity />
                    <UserInfo />
                </div>
            </div>

            <Transition mounted={opened} transition="scale-y" duration={400} timingFunction="ease">
                {(ddstyles) => 
                    <div style={ddstyles} className={`${styles.mobile_nav_menu}`}>
                        <NavigationItems user={user} />
                    </div>}
            </Transition>
        </nav>
    );
}

export default Header;