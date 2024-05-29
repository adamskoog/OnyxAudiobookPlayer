import { useAppSelector } from '@/store'

import PlexJavascriptApi from '@adamskoog/jsapi-for-plex'

import { NavButton } from '@/components/shared/Buttons';
import { saveSettingToStorage, SETTINGS_KEYS } from '@/utility';
import styles from './styles/UserInfo.module.css'


const doUserLogin = () => {
    const doAsync = async () => {
        const signInData = await PlexJavascriptApi.signIn();
        console.log("SIGN DATA", signInData)
        saveSettingToStorage(SETTINGS_KEYS.loginRedirectId, signInData.authId);
        window.location.href = signInData.url;   
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