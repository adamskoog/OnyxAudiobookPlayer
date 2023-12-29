import { ReactNode, useEffect, useRef, createContext, MutableRefObject } from 'react'
import { useRouter } from 'next/router';
import { ScrollArea } from '@mantine/core';
import Loader from '../shared/Loader';

import { Inter } from 'next/font/google'

import { useAppDispatch, useAppSelector } from '@/store'
import { initialize } from '@/store/features/applicationSlice'
import { initializeServer } from '@/store/features/serverSlice'

import styles from './styles/Layout.module.css'

import Header from '@/components/Header'
import Subheader from '@/components/Subheader'
import NowPlaying from '@/components/NowPlaying';
import { changePlayerView } from '@/store/features/playerSlice';

const inter = Inter({ subsets: ['latin'] })

type LayoutProps = {
    children: ReactNode
}

type ScrollContext = {
    ref: MutableRefObject<HTMLDivElement | null> | null
}
export const ScrollerRefContext = createContext<ScrollContext>({ ref: null });

export default function Layout({ children }: LayoutProps) {

    const router = useRouter();

    const dispatch = useAppDispatch()
    const scrollerRef = useRef<HTMLDivElement | null>(null);
    
    const user = useAppSelector((state) => state.application.user);
    const state = useAppSelector(state => state.application.state);
    const mode = useAppSelector(state => state.player.mode)
    const view = useAppSelector(state => state.player.view)

    useEffect(() => {
        dispatch(initialize())
    }, [])

    useEffect(() => {
        if (user) {
            dispatch(initializeServer());
        }
    }, [user]);

    useEffect(() => {
        
        if (mode !== 'stopped') {
            if (router.asPath.includes('nowplaying')) {
                dispatch(changePlayerView('maximized'))
                return;
            }
        }

        dispatch(changePlayerView('minimized'))
    }, [router.asPath])

    if (state === 'loading') return (
        <div className={`${styles.loader} ${inter.className}`}>
            <Loader loading={true} />
        </div>
    )

    let classes = [styles.main, inter.className];
    if (mode !== 'stopped') {
        classes.push(styles.show);
        if (view === 'maximized') classes.push(styles.maximized);
    }

    return (
        <>
            <Header />
            <Subheader />
            <main className={classes.join(' ')}>
                <ScrollArea className={`${styles.scrollRoot}`} viewportRef={scrollerRef}>
                    <div className={`${styles.content}`}>
                        <ScrollerRefContext.Provider value={{ ref: scrollerRef }}>
                            {children}
                        </ScrollerRefContext.Provider>
                    </div>
                </ScrollArea>
            </main>
            <NowPlaying />
        </>
  )
}