import type { PlexAlbumMetadata, PlexTrack } from "@/types/plex.types"

import TrackInfo from "./TrackInfo"

import styles from './styles/Tracks.module.css'

type TracksProps = {
    tracks: PlexTrack[],
    forceMetadataUpdate: () => Promise<void>
}

const trackCountLabel = (tracks: PlexTrack[]): string => {

    if (tracks.length == 1) return '1 Track';
    return `${tracks.length ?? 0} Tracks`;
}

export default function Tracks({ tracks, forceMetadataUpdate }: TracksProps) {

  return (
    <div>
        <div className={`${styles.track_count}`}>
            {trackCountLabel(tracks)}
        </div>
        <div className={`${styles.tracks}`}>
            {tracks.map(track => (
                <TrackInfo key={track.key} track={track} tracks={tracks} forceMetadataUpdate={forceMetadataUpdate} />
            ))}
        </div>
    </div>
  )
}
