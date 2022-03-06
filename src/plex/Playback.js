import { scrobble, unscrobble } from './Api';

// Plex has updated PMS so that libraries using stored track progress now complete at 99% officially.
const TRACK_COMPLETE_PERCENT = 0.99;   

const trackPercentComplete = (offset, duration) => {
    if (!offset || !duration) return 0;

    return offset / duration;
}

const trackIsStarted = (trackInfo) => {
    if (!trackInfo.viewOffset) return false;

    const percentComplete = trackPercentComplete(trackInfo.viewOffset, trackInfo.duration);
    if (percentComplete > 0)
        return true;
    return false;
}

export const trackIsComplete = (trackInfo) => {
    if (!trackInfo) return false;

    if (!trackInfo.viewOffset && trackInfo.viewCount && trackInfo.viewCount > 0)
        return true;

    const percentComplete = trackPercentComplete(trackInfo.viewOffset, trackInfo.duration);
    if (percentComplete >= TRACK_COMPLETE_PERCENT)
        return true;
    return false;
}

export const markTrackPlayed = async (trackInfo, baseUrl, token) => {
    await scrobble(baseUrl, trackInfo.ratingKey, token);
    return { status: 'success' };
}

export const markTrackUnplayed = async (trackInfo, baseUrl, token) => {
    await unscrobble(baseUrl, trackInfo.ratingKey, token);
    return { status: 'success' };
}

// On Deck - this is the first in progress or unplayed track that is encountered when
// going through the tracks in order. Trying to mimic what Plex does with TV shows,
// but for a single audio album.
export const findOnDeck = (albumInfo) => {
    //console.log("album", albumInfo);
    for (let i = 0; i < albumInfo.Metadata.length; i++) {
        const track = albumInfo.Metadata[i];

        // Track is Started, but not finished, we found On Deck
        if (trackIsStarted(track) && !trackIsComplete(track)) return track;
        
        // Is previous Track complete and current track not started, we found On Deck
        const prevTrack = albumInfo.Metadata[i-1];
        if (prevTrack) {
            if (trackIsComplete(prevTrack) && !trackIsComplete(track) && !trackIsStarted(track))
                return track;
        }
    }

    // No tracks in progress, return first track.
    return albumInfo.Metadata[0];
}

export const isTrackOnDeck = (trackInfo, album) => {
    const onDeck = findOnDeck(album);
    if (onDeck.key !== trackInfo.key) return false;
    return true;
}

export const updateOnDeck = (trackInfo, album, baseUrl, token) => {
    return new Promise((resolve) => {
        // We need to queue up promises for all the tracks in the album
        // if they select a current track that was in progress, it will not be updated.
        let promises = [];
        for (let i = 0; i < album.Metadata.length; i++) {
            const track = album.Metadata[i];
            if (trackInfo.index > track.index) {
                // previous tracks need to be marked as played
                promises.push(markTrackPlayed(track, baseUrl, token));
            } else if (trackInfo.index <= track.index) {
                // upcoming tracks should be marked as unplayed.
                promises.push(markTrackUnplayed(track, baseUrl, token));
            }
        }

        Promise.allSettled(promises)
            .then(() => {
                // promises have been settled
                resolve();
            });  
    });
}

// Generate album queue based on selected track.
export const getAlbumQueue = (selectedTrack, albumInfo) => {
    let queue = [];
    for (let i = 0; i < albumInfo.Metadata.length; i++) {
        const track = albumInfo.Metadata[i];

        if (selectedTrack.index <= track.index) {
            queue.push(track);
        }
    }

    return queue;
}