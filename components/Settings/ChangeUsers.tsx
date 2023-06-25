import { useAppDispatch } from '@/store'
import PlexJavascriptApi from '@/plex'

import { Button } from '@/components/shared/Buttons';
import { Avatar, Modal, PinInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import styles from './styles/ChangeUsers.module.css'
import { useState } from 'react';
import type { SwitchUserItem } from '@/types/plex.types';

function UserSelector({ user, setUser }: any) {

    const onClick = () => {
        if (setUser) setUser(user);
    }
    return (
        <div className={`${styles.user_item}`} onClick={onClick}>
            <Avatar radius="xl" size="xl" src={user.thumb}/>
            <div>{user.title ?? user.username}</div>
        </div>
    );
}

function ChangeUsers() {

    const [opened, { open, close }] = useDisclosure(false);

    const [users, setUsers] = useState<SwitchUserItem[]>([]);
    const [user, setUser] = useState<SwitchUserItem | null>(null);

    const changeUser = () => {
        const doAsync = async () => {
            const resp = await PlexJavascriptApi.getUsers();
            console.log("RESP", resp);
            setUsers(resp)
            open();
        }
        doAsync();
    }
    
    return (
        <>
            <Button onClick={changeUser}>{'Switch User'}</Button>

            <Modal opened={opened} onClose={close} title="Switch User">
                {!user ? (
                    <div className={`${styles.container}`}>
                        {users.map(item => (
                            <UserSelector key={item.uuid} user={item} setUser={setUser} />
                        ))}
                    </div>
                ) : (
                    <div className={`${styles.enter_pin}`}>
                        <UserSelector key={user.uuid} user={user} />
                        <div className={`${styles.pin_entry}`}>
                        <PinInput mask length={4} aria-label="PIN input"/>
                        </div>
                    </div>
                )}

            </Modal>
        </>
    );
}

export default ChangeUsers;