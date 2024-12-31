
import { useEffect } from 'react';
import Link from 'next/link';

import { useAppSelector } from '@/store';
import AudioPlayer from './AudioPlayer';
import { PlayerTime } from './controls';
import PlexImage from '../shared/PlexImage';

import styles from './styles/NowPlaying.module.css'
import PlexJavascriptApi from '@adamskoog/jsapi-for-plex';

function NowPlaying() {
  
    const mode = useAppSelector(state => state.player.mode);
    const view = useAppSelector(state => state.player.view);
    const currentTrack = useAppSelector(state => state.player.currentTrack);

    let classes = [styles.container];
    if (mode !== 'stopped' && mode !== 'ended') {
        classes.push(styles.show);
        if (view === 'maximized') classes.push(styles.maximized);
    }

    let imageSize = 100;
    if (view === 'maximized') imageSize = 400;
    return (
        <section className={classes.join(' ')}>
            <div className={`${styles.inner}`}>
                <div className={`${styles.cover}`}>
                    <PlexImage width={imageSize} height={imageSize} url={currentTrack?.thumb} alt={currentTrack?.title} hideRadius />
                </div>
                <div className={`${styles.track_info}`}>
                    <div className={`${styles.text}`}>{currentTrack?.title}</div>
                    <Link href={'/library/album/[ratingKey]'} as={`/library/album/${currentTrack?.parentRatingKey}`}>
                        <div className={`${styles.text} ${styles.muted}`}>{currentTrack?.parentTitle}</div>
                    </Link>
                    <div className={`${styles.text} ${styles.muted}`}>{currentTrack?.grandparentTitle}</div>
                    <div className={`${styles.text}`}>
                        <PlayerTime />
                    </div>
                </div>
                <AudioPlayer />
            </div>
        </section>
    );
}

// Possible Player Replacement: https://github.com/slash9494/react-modern-audio-player
export default NowPlaying;