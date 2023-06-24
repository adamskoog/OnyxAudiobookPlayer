import { useAppSelector, useAppDispatch } from '@/store'
import PlexJavascriptApi from '@/plex'

import { setActiveServer } from '@/store/features/serverSlice';
import { setActiveLibrary } from '@/store/features/librarySlice';

import { Button } from '@/components/shared/Buttons';
import { Select } from '@mantine/core';

import styles from './styles/Settings.module.css'

function Settings() {
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

    const testing = () => {
        const test = async () => {
            const resp = await PlexJavascriptApi.getUsers();
            console.log("RESP", resp);
        }
            // https://clients.plex.tv/api/home/users?X-Plex-Product=Plex%20Web&X-Plex-Version=4.108.0&X-Plex-Client-Identifier=pg5y4mmh8eq9gjkah65vt4ue&X-Plex-Platform=Microsoft%20Edge&X-Plex-Platform-Version=114.0&X-Plex-Features=external-media%2Cindirect-media%2Chub-style-list&X-Plex-Model=hosted&X-Plex-Device=Windows&X-Plex-Device-Name=Microsoft%20Edge&X-Plex-Device-Screen-Resolution=1920x937%2C1920x1080&X-Plex-Token=Kqi6dGG2E5rxDyrjYVzh&X-Plex-Language=en&X-Plex-Session-Id=d03b04f5-f957-4a85-81ff-72118a1eb567
        test();
    }
    const logout = () => {
        PlexJavascriptApi.logout()
    }

    return (
        <div className={`${styles.container}`}>
            {user && (
            <>
            <Select value={activeServer?.clientIdentifier} onChange={changeServer} data={serverOptions} />
            <Select value={libraryId} onChange={changeLibrary} data={libraryOptions} />

            <Button disabled={true} onClick={testing}>{'Switch User'}</Button>
            <Button onClick={logout}>{'Log out'}</Button>
            </>
            )}
        </div>
    );
}

export default Settings;