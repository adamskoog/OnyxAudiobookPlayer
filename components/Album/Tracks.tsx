import type { PlexTrack } from "@/types/plex.types"

import { formatTrackDisplay } from "@/utility"
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

const trackDurationLabel = (tracks: PlexTrack[]): string => {
    if (tracks.length < 2) return ''

    const duration = tracks.reduce((accumulator, track) => accumulator + track.duration, 0)
    return formatTrackDisplay(duration)
}

export default function Tracks({ tracks, forceMetadataUpdate }: TracksProps) {

  return (
    <div>
        <div className={`${styles.track_count}`}>
            <span>{trackCountLabel(tracks)}</span>
            <span>{trackDurationLabel(tracks)}</span>
        </div>
        <div className={`${styles.tracks}`}>
            {tracks.map(track => (
                <TrackInfo key={track.key} track={track} tracks={tracks} forceMetadataUpdate={forceMetadataUpdate} />
            ))}
        </div>
    </div>
  )
}
