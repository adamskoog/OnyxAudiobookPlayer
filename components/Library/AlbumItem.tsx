import Link from 'next/link';

import type { PlexAlbumMetadata } from '@adamskoog/jsapi-for-plex/plex.types';
import PlexImage from '../shared/PlexImage';
import styles from './styles/griditem.module.css'

type AlbumItemProps = {
    metadata: PlexAlbumMetadata
    showAuthor?: boolean
}

function AlbumItem({ metadata, showAuthor = false }: AlbumItemProps) {

    return (
        <Link href={'/library/album/[ratingKey]'} as={`/library/album/${metadata.ratingKey}`}>
            <div className={`${styles.container}`}>
                <div className={`${styles.image_container}`}>
                    <PlexImage width={240} height={240} url={metadata.thumb} alt={`${metadata.title}`} isLazy />
                </div>
                <div className={`${styles.album_title}`} title={metadata.title}>{metadata.title}</div>
                {showAuthor && (
                <div className={`${styles.artist_title}`} title={metadata.parentTitle}>{metadata.parentTitle}</div>
                )}
            </div>
        </Link>
    );
}

export default AlbumItem;