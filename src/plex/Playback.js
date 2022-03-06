import * as PlexApi from './Api';

class PlexPlayback
{
    // Plex has updated PMS so that libraries using stored track progress now complete at 99% officially.
    static TRACK_COMPLETE_PERCENT = 0.99;   

    static trackPercentComplete(offset, duration) {
        if (!offset || !duration) return 0;

        return offset / duration;
    }

    static trackIsStarted(trackInfo) {
        if (!trackInfo.viewOffset) return false;

        const percentComplete = PlexPlayback.trackPercentComplete(trackInfo.viewOffset, trackInfo.duration);
        if (percentComplete > 0)
            return true;
        return false;
    }

    static trackIsComplete(trackInfo) {
        if (!trackInfo) return false;

        if (!trackInfo.viewOffset && trackInfo.viewCount && trackInfo.viewCount > 0)
            return true;

        const percentComplete = PlexPlayback.trackPercentComplete(trackInfo.viewOffset, trackInfo.duration);
        if (percentComplete >= PlexPlayback.TRACK_COMPLETE_PERCENT)
            return true;
        return false;
    }

    static markTrackPlayed(trackInfo, baseUrl, token) {
        return new Promise((resolve) => {
            PlexApi.scrobble(baseUrl, trackInfo.ratingKey, token)
                .then(data => { 
                    //console.log("");
                    resolve();
                });
        });
    }

    static markTrackUnplayed(trackInfo, baseUrl, token) {
        return new Promise((resolve) => {
            PlexApi.unscrobble(baseUrl, trackInfo.ratingKey, token)
                .then(data => { 
                    //console.log("");
                    resolve();
                });
        });
    }

    // On Deck - this is the first in progress or unplayed track that is encountered when
    // going through the tracks in order. Trying to mimic what Plex does with TV shows,
    // but for a single audio album.
    static findOnDeck(albumInfo) {
        //console.log("album", albumInfo);
        for (let i = 0; i < albumInfo.Metadata.length; i++) {
            const track = albumInfo.Metadata[i];

            // Track is Started, but not finished, we found On Deck
            if (PlexPlayback.trackIsStarted(track) 
                && !PlexPlayback.trackIsComplete(track)) {
                    return track;
                }
            
            // Is previous Track complete and current track not started, we found On Deck
            const prevTrack = albumInfo.Metadata[i-1];
            if (prevTrack) {
                if (PlexPlayback.trackIsComplete(prevTrack)
                    && !PlexPlayback.trackIsComplete(track)
                    && !PlexPlayback.trackIsStarted(track)) {
                    return track;
                }
            }
        }

        // No tracks in progress, return first track.
        return albumInfo.Metadata[0];
    }

    static isTrackOnDeck(trackInfo, album) {
        const onDeck = PlexPlayback.findOnDeck(album);
        if (onDeck.key !== trackInfo.key) return false;
        return true;
    }

    static updateOnDeck(trackInfo, album, baseUrl, token) {
        return new Promise((resolve) => {
            // We need to queue up promises for all the tracks in the album
            // if they select a current track that was in progress, it will not be updated.
            let promises = [];
            for (let i = 0; i < album.Metadata.length; i++) {
                const track = album.Metadata[i];
                if (trackInfo.index > track.index) {
                    // previous tracks need to be marked as played
                    promises.push(PlexPlayback.markTrackPlayed(track, baseUrl, token));
                } else if (trackInfo.index <= track.index) {
                    // upcoming tracks should be marked as unplayed.
                    promises.push(PlexPlayback.markTrackUnplayed(track, baseUrl, token));
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
    static getAlbumQueue(selectedTrack, albumInfo) {
        let queue = [];
        for (let i = 0; i < albumInfo.Metadata.length; i++) {
            const track = albumInfo.Metadata[i];

            if (selectedTrack.index <= track.index) {
                queue.push(track);
            }
        }

        return queue;
    }
}

export default PlexPlayback;