import { useAppDispatch } from '@/store'
import PlexJavascriptApi from '@adamskoog/jsapi-for-plex'

import { Button } from '@/components/shared/Buttons';
import { Avatar, Modal, PinInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { switchUser } from '@/store/features/applicationSlice';
import { clearActiveLibrary } from '@/store/features/librarySlice';
import { saveSettingToStorage, removeSettingFromStorage, SETTINGS_KEYS } from '@/utility';
import styles from './styles/ChangeUsers.module.css'
import { useEffect, useState } from 'react';
import type { SwitchUserItem } from '@adamskoog/jsapi-for-plex/plex.types';

type UserSelectorProps = {
    user: SwitchUserItem,
    setUser?: (user: SwitchUserItem) => void
}

function UserSelector({ user, setUser }: UserSelectorProps) {

    const onClick = () => {
        if (setUser) setUser(user);
    }

    return (
        <li className={`${styles.user_item} user-selector`}>
            <button className={`${styles.select_user_button}`} onClick={onClick}>
                <div className={`${styles.avatar}`}>
                    <Avatar radius="xl" size="xl" src={user.thumb}/>
                </div>
                <div className={`${styles.caption}`}>
                    <div>{user.title}</div>
                    <div className={`${styles.username}`}>{(user.username !== '') ? user.username : 'Managed Account'}</div>
                </div>
            </button>
        </li>
    );
}

function ChangeUsers() {

    const dispatch = useAppDispatch();
    const [opened, { open, close }] = useDisclosure(false);

    const [users, setUsers] = useState<SwitchUserItem[]>([]);
    const [user, setUser] = useState<SwitchUserItem | null>(null);

    const changeUser = () => {
        const doAsync = async () => {
            const resp = await PlexJavascriptApi.getUsers();
            setUsers(resp)
            open();
        }
        doAsync();
    }
    
    useEffect(() => {
        setUser(null);
    }, [opened])

    const noClose = () => {}

    const doUserSwitch = (user: SwitchUserItem, pin?: string) => {
        const doAsync = async () => {
            const newUser = await PlexJavascriptApi.switchUser(user, pin);
            removeSettingFromStorage(SETTINGS_KEYS.serverId)
            removeSettingFromStorage(SETTINGS_KEYS.libraryId)
    
            // Update settings and class state with the current user token.
            saveSettingToStorage(SETTINGS_KEYS.token, newUser.authToken);

            dispatch(switchUser(newUser));
            close()
        }

        doAsync()
    }
    
    const onPinComplete = (value: string): void => {
        if (!user) return;
        doUserSwitch(user, value);
    }

    const selectUser = (user: SwitchUserItem) => {
        if (user.protected) {
            setUser(user)
        } else {
            doUserSwitch(user);
        }
    }

    return (
        <>
            <Button onClick={changeUser}>{'Switch User'}</Button>

            <Modal opened={opened} size={700} onClose={noClose} title="Switch User">
                {!user ? (
                    <ul className={`${styles.container}`}>
                        {users.map(item => (
                            <UserSelector key={item.uuid} user={item} setUser={selectUser} />
                        ))}
                    </ul>
                ) : (
                    <div className={`${styles.enter_pin}`}>
                        <UserSelector key={user.uuid} user={user} />
                        <div className={`${styles.pin_entry}`}>
                        <PinInput autoFocus mask length={4} aria-label="PIN input" inputMode='numeric' onComplete={onPinComplete} />
                        </div>
                    </div>
                )}

            </Modal>
        </>
    );
}

export default ChangeUsers;