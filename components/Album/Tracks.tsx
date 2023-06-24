import type { PlexAlbumMetadata, PlexTrack } from "@/types/plex.types"

import TrackInfo from "./TrackInfo"

import styles from './styles/Tracks.module.css'

type TracksProps = {
    album: PlexAlbumMetadata,
    forceMetadataUpdate: () => Promise<void>
}

const trackCountLabel = (tracks: PlexTrack[]): string => {

    if (tracks.length == 1) return '1 Track';
    return `${tracks.length ?? 0} Tracks`;
}

export default function Tracks({ album, forceMetadataUpdate }: TracksProps) {

  return (
    <div>
        <div className={`${styles.track_count}`}>
            {trackCountLabel(album.Metadata)}
        </div>
        <div className={`${styles.tracks}`}>
            {album.Metadata.map(track => (
                <TrackInfo key={track.key} track={track} album={album} forceMetadataUpdate={forceMetadataUpdate} />
            ))}
        </div>
    </div>
  )
}
