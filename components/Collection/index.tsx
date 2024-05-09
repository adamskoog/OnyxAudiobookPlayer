'use client'
import useCollectionMetadata from './hooks/useCollectionMetadata';

import Loader from '../shared/Loader';
import PlexImage from '../shared/PlexImage';
import Summary from '../Album/Summary';
import Albums from '../Artist/Albums';

import styles from './styles/Collection.module.css'


type CollectionPageProps = {
    ratingKey: string
}

function CollectionPage({ ratingKey }: CollectionPageProps) {

    const { collection, albums, loading } = useCollectionMetadata({ ratingKey });

    if (loading) return <Loader loading={loading} />
    if (!collection) return <div></div>

    return (
        <>
            <div className={`${styles.artist_container}`}>
                <div className={`${styles.cover}`}>
                    <PlexImage width={240} height={240} url={collection.thumb} alt={`${collection.title} Image`} minSize={true} upscale={true} />
                </div>
                <div className={`${styles.meta_container}`}>
                    <div className={`${styles.artist_name}`}>{collection.title}</div>
                    <Summary summary={collection.summary} />
                </div>
            </div>
            {albums && (
            <Albums albums={albums} />
            )}
        </>

    );
}

export default CollectionPage;