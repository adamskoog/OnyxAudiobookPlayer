import { useAppSelector, useAppDispatch } from '@/store'

import { logout } from '@/store/features/applicationSlice';
import { clearServerData, setActiveServer } from '@/store/features/serverSlice';
import { setActiveLibrary } from '@/store/features/librarySlice';

import { Button } from '@/components/shared/Buttons';
import { Select } from '@mantine/core';
import { setSkipBackwardIncrement, setSkipForwardIncrement } from '@/store/features/playerSlice';
import ChangeUsers from './ChangeUsers';
import styles from './styles/Settings.module.css'
import PlexJavascriptApi from '@/plex';

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

    const changeServer = (value: string) => {
        dispatch(setActiveServer(value));
    }

    const changeLibrary = (value: string) => {
        dispatch(setActiveLibrary(value))
    }

    const signout = () => {
        PlexJavascriptApi.logout();
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