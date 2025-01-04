'use client'
import { useAppSelector, useAppDispatch } from '@/store'

import { logout } from '@/store/features/applicationSlice';
import { clearServerData, setActiveServer } from '@/store/features/serverSlice';
import { setActiveLibrary } from '@/store/features/librarySlice';

import { clearSettings } from '@/utility';

import { Button } from '@/components/shared/Buttons';
import { Select } from '@mantine/core';
import { setPlaybackRate, setSkipBackwardIncrement, setSkipForwardIncrement } from '@/store/features/playerSlice';
import ChangeUsers from './ChangeUsers';
import styles from './styles/Settings.module.css'
import PlexJavascriptApi from '@adamskoog/jsapi-for-plex';

import { SETTINGS_KEYS } from '@/utility';
import Switch from './Switch';

type SettingsProps = {
    appVersion: string
}

function Settings({ appVersion }: SettingsProps) {
    const dispatch = useAppDispatch();

    const user = useAppSelector(state => state.application.user);
    const resources = useAppSelector(state => state.application.servers)
    const libraries = useAppSelector(state => state.server.libraries)
    const activeServer = useAppSelector(state => state.server.activeServer)
    const libraryId = useAppSelector(state => state.library.libraryId)

    const skipBackwardIncrement = useAppSelector(state => state.player.skipBackwardIncrement);
    const skipForwardIncrement = useAppSelector(state => state.player.skipForwardIncrement);
    const playbackRate = useAppSelector(state => state.player.playbackRate);

    const serverOptions = resources.map(resource => {
        return { value: resource.clientIdentifier, label: resource.name }
    })
    const libraryOptions = libraries.map(library => {
        return { value: library.key, label: library.title }
    })

    const skipOptions = [
        { value: '5', label: '5'},
        { value: '10', label: '10'},
        { value: '15', label: '15'},
        { value: '20', label: '20'},
        { value: '25', label: '25'},
        { value: '30', label: '30'},
        { value: '35', label: '35'},
        { value: '40', label: '40'},
        { value: '45', label: '45'},
        { value: '50', label: '50'},
        { value: '55', label: '55'},
        { value: '60', label: '60'},
    ]
    
    const playbackRateOptions = [
        { value: '0.5', label: '0.5x'},
        { value: '0.75', label: '0.75x'},
        { value: '0.9', label: '0.9x'},
        { value: '1', label: '1.0x'},
        { value: '1.1', label: '1.1x'},
        { value: '1.25', label: '1.25x'},
        { value: '1.5', label: '1.5x'},
    ]

    const changeServer = (value: string | null) => {
        dispatch(setActiveServer(value ?? ''));
    }

    const changeLibrary = (value: string | null) => {
        dispatch(setActiveLibrary(value ?? ''))
    }

    const signout = () => {
        clearSettings();
        dispatch(clearServerData())
        dispatch(logout())
    }

    if (!user) return <></>
    return (
        <div className={`${styles.container}`}>
            {user && (
            <>
            <Select value={activeServer?.clientIdentifier ?? null} onChange={changeServer} data={serverOptions} />
            <Select value={libraryId} onChange={changeLibrary} data={libraryOptions} />
            <Select label="Skip Backwards (in seconds)" 
                    value={skipBackwardIncrement.toString()} 
                    onChange={(value) => {
                        if (value) dispatch(setSkipBackwardIncrement(parseInt(value)));
                    }}
                    data={skipOptions} />
            <Select label="Skip Forwards (in seconds)" 
                    value={skipForwardIncrement.toString()} 
                    onChange={(value) => {
                        if (value) dispatch(setSkipForwardIncrement(parseInt(value)));
                    }}
                    data={skipOptions} />
            <Select label="Playback Rate" 
                    value={playbackRate.toString()} 
                    onChange={(value) => {
                        if (value) dispatch(setPlaybackRate(parseFloat(value)));
                    }}
                    data={playbackRateOptions} />
            <Switch label={'Enable Saving Library Scroll Position'} 
                storageKey={SETTINGS_KEYS.storeLibraryScrollPosition} 
                isBeta={true} 
            />
            {user.home && (<ChangeUsers />)}
            <Button onClick={signout}>{'Log out'}</Button>
            <div className={`${styles.version}`}>
                <div>{'Application Version:'}</div>
                <div>{appVersion}</div>
            </div>
            </>
            )}
        </div>
    );
}

export default Settings;