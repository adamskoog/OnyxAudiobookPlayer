import PlexApi from './Api';

class PlexPlayback
{
    // Value in which we consider a track completed. This will hopefully only be temporary
    // and can be tightened up a bit once things are a bit more fully implemented.
    static TRACK_COMPLETE_PERCENT = 0.95;
    static TRACK_DURATION_FACTOR = 5;

    static trackPercentComplete(offset, duration) {
        if (!offset || !duration) return 0;

        return offset / duration;
    }

    static trackIsStarted(offset, duration) {
        if (!offset) return false;

        const percentComplete = PlexPlayback.trackPercentComplete(offset, duration);
        if (percentComplete > 0)
            return true;
        return false;
    }

    static trackIsComplete(offset, duration) {
        if (!offset) return false;

        const percentComplete = PlexPlayback.trackPercentComplete(offset, duration);
        if (percentComplete >= PlexPlayback.TRACK_COMPLETE_PERCENT)
            return true;
        return false;
    }

    static markTrackPlayed(trackInfo, baseUrl, token) {
        return new Promise((resolve) => {
            let doneTime = Math.round(trackInfo.duration * 0.96);

            let args = {
                key: trackInfo.ratingKey,
                time: doneTime, 
                "X-Plex-Token": token
            };
            PlexApi.progress(baseUrl, args)
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

    // To keep track of tracks beyond 90%, we can increase the value of the duration on timeline updates,
    // this will keep the trackInfo.viewOffset from being removed to allow keeping track of completed tracks.
    static timelineTrackDurationFlex(ms) {
        if (!ms) return 0;
        return ms * PlexPlayback.TRACK_DURATION_FACTOR;
    }

    // On Deck - this is the first in progress or unplayed track that is encountered when
    // going through the tracks in order. Need to create code to manage track progress state.
    // If a user starts a track that is not the next, we need to update previous and following
    // tracks to be in the correct play state to manage things correctly.
    static findOnDeck(albumInfo) {
        //console.log("album", albumInfo);
        for (let i = 0; i < albumInfo.Metadata.length; i++) {
            const track = albumInfo.Metadata[i];

            // Track is Started, but not finished, we found On Deck
            if (PlexPlayback.trackIsStarted(track.viewOffset, track.duration) 
                && !PlexPlayback.trackIsComplete(track.viewOffset, track.duration)) {
                    return track;
                }
            
            // Is previous Track complete and current track not started, we found On Deck
            const prevTrack = albumInfo.Metadata[i-1];
            if (prevTrack) {
                if (PlexPlayback.trackIsComplete(prevTrack.viewOffset, prevTrack.duration)
                    && !PlexPlayback.trackIsStarted(track.viewOffset, track.duration))
                    return track;
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

    // Genereate album queue based on selected track.
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