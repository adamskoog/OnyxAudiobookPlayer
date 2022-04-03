import { PlexServerApi } from './Api';

// Plex has updated PMS so that libraries using stored track progress now complete at 99% officially.
const TRACK_COMPLETE_PERCENT = 0.99;

const trackPercentComplete = (offset: number, duration: number): number => {
  if (!offset || !duration) return 0;

  return offset / duration;
};

const trackIsStarted = (trackInfo: any): boolean => {
  if (!trackInfo.viewOffset) return false;

  const percentComplete = trackPercentComplete(trackInfo.viewOffset, trackInfo.duration);
  if (percentComplete > 0) return true;
  return false;
};

export const trackIsComplete = (trackInfo: any): boolean => {
  if (!trackInfo) return false;

  if (!trackInfo.viewOffset && trackInfo.viewCount && trackInfo.viewCount > 0) return true;

  const percentComplete = trackPercentComplete(trackInfo.viewOffset, trackInfo.duration);
  if (percentComplete >= TRACK_COMPLETE_PERCENT) return true;
  return false;
};

export const markTrackPlayed = async (trackInfo: any): Promise<any> => {
  await PlexServerApi.scrobble(trackInfo.ratingKey);
  return { status: 'success' };
};

export const markTrackUnplayed = async (trackInfo: any): Promise<any> => {
  await PlexServerApi.unscrobble(trackInfo.ratingKey);
  return { status: 'success' };
};

// On Deck - this is the first in progress or unplayed track that is encountered when
// going through the tracks in order. Trying to mimic what Plex does with TV shows,
// but for a single audio album.
export const findOnDeck = (albumInfo: any): any => {
  // console.log("album", albumInfo);
  for (let i = 0; i < albumInfo.Metadata.length; i++) {
    const track = albumInfo.Metadata[i];

    // Track is Started, but not finished, we found On Deck
    if (trackIsStarted(track) && !trackIsComplete(track)) return track;

    // Is previous Track complete and current track not started, we found On Deck
    const prevTrack = albumInfo.Metadata[i - 1];
    if (prevTrack) {
      if (trackIsComplete(prevTrack) && !trackIsComplete(track) && !trackIsStarted(track)) return track;
    }
  }

  // No tracks in progress, return first track.
  return albumInfo.Metadata[0];
};

export const isTrackOnDeck = (trackInfo: any, album: any): boolean => {
  const onDeck = findOnDeck(album);
  if (onDeck.key !== trackInfo.key) return false;
  return true;
};

export const updateOnDeck = (trackInfo: any, album: any): Promise<any> => new Promise((resolve) => {
  // We need to queue up promises for all the tracks in the album
  // if they select a current track that was in progress, it will not be updated.
  const promises: Array<any> = [];
  for (let i = 0; i < album.Metadata.length; i++) {
    const track = album.Metadata[i];
    if (trackInfo.index > track.index) {
      // previous tracks need to be marked as played
      promises.push(markTrackPlayed(track));
    } else if (trackInfo.index <= track.index) {
      // upcoming tracks should be marked as unplayed.
      promises.push(markTrackUnplayed(track));
    }
  }

  Promise.allSettled(promises)
    .then(() => {
      // promises have been settled
      resolve(true);
    });
});

// Generate album queue based on selected track.
export const getAlbumQueue = (selectedTrack: any, albumInfo: any): Array<any> => {
  const queue: Array<any> = [];
  for (let i = 0; i < albumInfo.Metadata.length; i++) {
    const track = albumInfo.Metadata[i];

    if (selectedTrack.index <= track.index) {
      queue.push(track);
    }
  }

  return queue;
};
