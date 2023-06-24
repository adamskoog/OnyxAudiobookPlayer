import { Burger, Transition } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import { useAppSelector } from '@/store'

import UserInfo from './UserInfo'
import { NavLinkButton } from '@/components/shared/Buttons';
import { useOutsideClick } from '@/hooks';

import type { PlexUser } from '@/types/plex.types';

import styles from './styles/Header.module.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

type NavigationItemsProps = {
    user: PlexUser | null
}

function NavigationItems({ user }: NavigationItemsProps) {
    return (
        <>
        <NavLinkButton title={'Home'} url={'/'}/>

        {/* Hide buttons when user is not logged in as they will not have access. */}
        {user && (
            <>
            <NavLinkButton title={'Library'} url={'/library'}/>
            <NavLinkButton title={'Settings'} url={'/settings'} />
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

                <UserInfo />
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