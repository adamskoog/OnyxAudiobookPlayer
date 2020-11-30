//import TimeUtils from '../utility/time';
import PlexRequest from './PlexRequest';

class AlbumHelpers
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

        const percentComplete = AlbumHelpers.trackPercentComplete(offset, duration);
        if (percentComplete > 0)
            return true;
        return false;
    }

    static trackIsComplete(offset, duration) {
        if (!offset) return false;

        const percentComplete = AlbumHelpers.trackPercentComplete(offset, duration);
        if (percentComplete >= AlbumHelpers.TRACK_COMPLETE_PERCENT)
            return true;
        return false;
    }

    static markTrackPlayed(trackInfo, baseUrl, token) {
        let testDuration = AlbumHelpers.timelineTrackDurationFlex(trackInfo.duration);
        let testTime = testDuration * 0.96;
        console.log("test", testDuration, testTime);

        let args = {
            ratingKey: trackInfo.ratingKey,
            key: trackInfo.key,
            state: "playing",
            time: testTime,                     //TimeUtils.convertSecondsToMs(trackInfo.duration - 1),
            playbackTime: testTime,             //TimeUtils.convertSecondsToMs(trackInfo.duration - 1),
            duration: testDuration,             //AlbumHelpers.timelineTrackDurationFlex(TimeUtils.convertSecondsToMs(trackInfo.duration)),
            "X-Plex-Token": token
        };
        PlexRequest.updateTimeline(baseUrl, args)
            .then(data => { 
                console.log("set playing?", data);
                let args = {
                    ratingKey: trackInfo.ratingKey,
                    key: trackInfo.key,
                    state: "stopped",
                    time: testTime,                     //TimeUtils.convertSecondsToMs(trackInfo.duration - 1),
                    playbackTime: testTime,             //TimeUtils.convertSecondsToMs(trackInfo.duration - 1),
                    duration: testDuration,             //AlbumHelpers.timelineTrackDurationFlex(TimeUtils.convertSecondsToMs(trackInfo.duration)),
                    "X-Plex-Token": token
                };
                PlexRequest.updateTimeline(baseUrl, args)
                    .then(data => { 
                        console.log("set stopped?", data);
                     });
             });
    }

    // To keep track of tracks beyond 90%, we can increase the value of the duration on timeline updates,
    // this will keep the trackInfo.viewOffset from being removed to allow keeping track of completed tracks.
    static timelineTrackDurationFlex(ms) {
        if (!ms) return 0;
        return ms * AlbumHelpers.TRACK_DURATION_FACTOR;
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
            if (AlbumHelpers.trackIsStarted(track.viewOffset, track.duration) 
                && !AlbumHelpers.trackIsComplete(track.viewOffset, track.duration)) {
                    return track;
                }
            
            // Is previous Track complete and current track not started, we found On Deck
            const prevTrack = albumInfo.Metadata[i-1];
            if (prevTrack) {
                if (AlbumHelpers.trackIsComplete(prevTrack.viewOffset, prevTrack.duration)
                    && !AlbumHelpers.trackIsStarted(track.viewOffset, track.duration))
                    return track;
            }
        }

        // No tracks in progress, return first track.
        return albumInfo.Metadata[0];
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

export default AlbumHelpers;