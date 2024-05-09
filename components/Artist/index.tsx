'use client'
import useArtistMetadata from './hooks/useArtistMetadata';

import Loader from '../shared/Loader';
import PlexImage from '../shared/PlexImage';
import Summary from '../Album/Summary';
import Albums from './Albums';

import styles from './styles/Artist.module.css'


type ArtistPageProps = {
    ratingKey: string
}

function ArtistPage({ ratingKey }: ArtistPageProps) {

    const { artist, loading } = useArtistMetadata({ ratingKey });

    if (loading) return <Loader loading={loading} />
    if (!artist) return <div></div>

    return (
        <>
            <div className={`${styles.artist_container}`}>
                <div className={`${styles.cover}`}>
                    <PlexImage width={200} height={200} url={artist.thumb} alt={`${artist.parentTitle} Image`} />
                </div>
                <div className={`${styles.meta_container}`}>
                    <div className={`${styles.artist_name}`}>{artist.parentTitle}</div>
                    <Summary summary={artist.summary} />
                </div>
            </div>
            <Albums albums={artist.Metadata} />
        </>

    );
}

export default ArtistPage;