import Link from 'next/link';

import type { PlexArtistListMetadata } from '@/types/plex.types';
import PlexImage from '../shared/PlexImage';
import styles from './styles/griditem.module.css'

type ArtistItemProps = {
    metadata: PlexArtistListMetadata
}

function ArtistItem({ metadata }: ArtistItemProps) {

    return (
        <Link href={'/library/artist/[ratingKey]'} as={`/library/artist/${metadata.ratingKey}`}>
        <div className={`${styles.container}`}>
            <div className={`${styles.image_container}`}>
                <PlexImage width={240} height={240} url={metadata.thumb} alt={`${metadata.title}`} isLazy />
            </div>
            <div className={`${styles.album_title}`} title={metadata.title}>{metadata.title}</div>
        </div>
        </Link>
    );
}

export default ArtistItem;