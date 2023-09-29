import Link from 'next/link';

import type { PlexCollectionMetadata } from '@/types/plex.types';
import PlexImage from '../shared/PlexImage';
import styles from './styles/griditem.module.css'

type CollectionItemProps = {
    metadata: PlexCollectionMetadata
}

function CollectionItem({ metadata }: CollectionItemProps) {

    return (
        <Link href={'/library/collection/[ratingKey]'} as={`/library/collection/${metadata.ratingKey}`}>
        <div className={`${styles.container}`}>
            <div className={`${styles.image_container}`}>
                <PlexImage width={240} height={240} url={metadata.thumb} alt={`${metadata.title} Image`} minSize={true} upscale={true} isLazy />
            </div>
            <div className={`${styles.album_title}`} title={metadata.title}>{metadata.title}</div>
            <div className={`${styles.artist_title}`} title={`${metadata.childCount} books`}>{`${metadata.childCount} books`}</div>
        </div>
        </Link>
    );
}

export default CollectionItem;