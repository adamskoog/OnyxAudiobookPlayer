'use client'
import { ReactNode, useEffect, useRef, createContext, MutableRefObject } from 'react'
import { usePathname } from 'next/navigation'
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

import pjson from '@/package.json'

import { store } from '@/store'
import { Provider } from 'react-redux'

const inter = Inter({ subsets: ['latin'] })

type LayoutProps = {
    children: ReactNode
}

type ScrollContext = {
    ref: MutableRefObject<HTMLDivElement | null> | null
}
export const ScrollerRefContext = createContext<ScrollContext>({ ref: null });

function LayoutInner({ children }: LayoutProps) {

    const pathname = usePathname()

    const dispatch = useAppDispatch()
    const scrollerRef = useRef<HTMLDivElement | null>(null);
    
    const user = useAppSelector((state) => state.application.user);
    const state = useAppSelector(state => state.application.state);
    const mode = useAppSelector(state => state.player.mode)
    const view = useAppSelector(state => state.player.view)

    useEffect(() => {
        dispatch(initialize({ title: pjson.appTitle, version: pjson.version}))        
    }, [])

    useEffect(() => {
        if (user) {
            dispatch(initializeServer());
        }
    }, [user]);

    useEffect(() => {    
        if (mode !== 'stopped') {
            if (pathname.includes('nowplaying') && view !== 'maximized') {
                dispatch(changePlayerView('maximized'))
                return;
            }
        }

        if (view !== 'minimized') dispatch(changePlayerView('minimized'))
    }, [pathname])

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
        <div className='app-root'>
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
        </div>
  )
}

export default function Layout({ children }: LayoutProps) {
    return (
        <Provider store={store}>
            <LayoutInner>
                {children}
            </LayoutInner>
        </Provider>
  )
}