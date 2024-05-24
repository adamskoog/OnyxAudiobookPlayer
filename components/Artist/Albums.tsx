import type { PlexAlbumMetadata } from "@/plex/plex.types"

import AlbumItem from "../Library/AlbumItem"

import styles from './styles/Albums.module.css'

type AlbumsProps = {
    albums: PlexAlbumMetadata[]
}

const albumCountLabel = (albums: PlexAlbumMetadata[]): string => {

    if (albums.length == 1) return '1 Album';
    return `${albums.length ?? 0} Albums`;
}

export default function Albums({ albums }: AlbumsProps) {

  return (
    <div className={`${styles.container}`}>
        <div className={`${styles.album_count}`}>
            {albumCountLabel(albums)}
        </div>
        <div className={`${styles.albums}`}>
            {albums.map(album => (
                <AlbumItem key={album.key} metadata={album} />
            ))}
        </div>
    </div>
  )
}
