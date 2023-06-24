import Link from 'next/link';

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

    const { album, loading } = useAlbumMetadata({ ratingKey });

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
                        <Link href={'/artist/[ratingKey]'} as={`/artist/${album.parentRatingKey}`}>{album.parentTitle}</Link>
                    </div>
                    <div className={`${styles.album_year}`}>{album.year}</div>
                    <div className={`${styles.track_ondeck}`}>
                        <OnDeck album={album} />
                    </div>
                </div>
            </div>
            <Summary summary={album.summary} />
            <Tracks tracks={album.Metadata} />
        </>

    );
}

export default AlbumPage;