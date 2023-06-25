import { useAppSelector, useAppDispatch } from '@/store'

import { logout } from '@/store/features/applicationSlice';
import { setActiveServer } from '@/store/features/serverSlice';
import { setActiveLibrary } from '@/store/features/librarySlice';

import { Button } from '@/components/shared/Buttons';
import { Select } from '@mantine/core';

import ChangeUsers from './ChangeUsers';
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

    const signout = () => {
        dispatch(logout())
    }

    if (!user) return <></>
    return (
        <div className={`${styles.container}`}>
            {user && (
            <>
            <Select value={activeServer?.clientIdentifier} onChange={changeServer} data={serverOptions} />
            <Select value={libraryId} onChange={changeLibrary} data={libraryOptions} />

            {user.home && (<ChangeUsers />)}
            <Button onClick={signout}>{'Log out'}</Button>
            </>
            )}
        </div>
    );
}

export default Settings;