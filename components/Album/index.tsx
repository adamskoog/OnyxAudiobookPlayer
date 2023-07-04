import { useEffect } from 'react';
import Link from 'next/link';

import { useAppSelector } from '@/store';
import Loader from '../shared/Loader';
import PlexImage from '../shared/PlexImage';
import OnDeck from './OnDeck';
import Summary from './Summary';
import Tracks from './Tracks';

import useAlbumMetadata from './hooks/useAlbumMetadata';

import styles from './styles/Album.module.css'


type AlbumPageProps = {
    ratingKey: string
}

function AlbumPage({ ratingKey }: AlbumPageProps) {

    const currentTrack = useAppSelector(state => state.player.currentTrack);
    
    const { album, tracks, loading, forceMetadataUpdate } = useAlbumMetadata({ ratingKey });

    useEffect(() => {
        if (album) forceMetadataUpdate();
    }, [album, currentTrack])

    if (loading) return <Loader loading={loading} />
    if (!album) return <div></div>

    return (
        <>
            <div className={`${styles.album_container}`}>
                <div className={`${styles.cover}`}>
                    <PlexImage width={200} height={200} url={album.thumb} alt={`${album.title} Cover`} />
                </div>
                <div className={`${styles.meta_container}`}>
                    <div className={`${styles.album_title}`}>{album.title}</div>
                    <div className={`${styles.album_author}`}>
                        <Link href={'/library/artist/[ratingKey]'} as={`/library/artist/${album.parentRatingKey}`}>{album.parentTitle}</Link>
                    </div>
                    <div className={`${styles.album_year}`}>{album.year}</div>
                    {tracks && (
                    <div className={`${styles.track_ondeck}`}>
                        <OnDeck album={album} tracks={tracks} />
                    </div>
                    )}
                </div>
            </div>
            <Summary summary={album.summary} />
            {tracks && (
            <Tracks tracks={tracks} forceMetadataUpdate={forceMetadataUpdate} />
            )}
        </>

    );
}

export default AlbumPage;