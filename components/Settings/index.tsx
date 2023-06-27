import { useAppSelector, useAppDispatch } from '@/store'

import { logout } from '@/store/features/applicationSlice';
import { clearServerData, setActiveServer } from '@/store/features/serverSlice';
import { setActiveLibrary } from '@/store/features/librarySlice';

import { Button } from '@/components/shared/Buttons';
import { Select } from '@mantine/core';

import ChangeUsers from './ChangeUsers';
import styles from './styles/Settings.module.css'
import PlexJavascriptApi from '@/plex';

type SettingsProps = {
    appVersion: string
}
function Settings({ appVersion }: SettingsProps) {
    const dispatch = useAppDispatch();

    const user = useAppSelector((state) => state.application.user);
    const resources = useAppSelector((state) => state.application.servers)
    const libraries = useAppSelector(state => state.server.libraries)
    const activeServer = useAppSelector((state) => state.server.activeServer)
    const libraryId = useAppSelector(state => state.library.libraryId)

    const serverOptions = resources.map(resource => {
        return { value: resource.clientIdentifier, label: resource.name }
    })
    const libraryOptions = libraries.map(library => {
        return { value: library.key, label: library.title }
    })

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