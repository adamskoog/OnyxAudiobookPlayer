import { useAppSelector } from '@/store'

import PlexJavascriptApi from '@/plex'

import { NavButton } from '@/components/shared/Buttons';

import styles from './styles/UserInfo.module.css'


const doUserLogin = () => {
    const doAsync = async () => {
        const url = await PlexJavascriptApi.signIn();
        window.location.href = url;   
    }
    doAsync()
};

function Profile() {

    const user = useAppSelector((state) => state.application.user);
    const appState = useAppSelector((state) => state.application.state);

    if (appState === 'loading') return <></>

    if (!user) {
        return (
            <NavButton onClick={() => doUserLogin()}>{'Log in'}</NavButton>
        )
    }
    
    return (
        <div className={`${styles.profile}`} title={`${user.username}`}>
            <img src={user.thumb} alt={`${user.username} avatar image`} />
        </div>
    );
}

export default Profile;