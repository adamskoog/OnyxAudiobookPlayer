import PlexJavascriptApi from "..";
import type { PlexAlbumMetadata, PlexTrack } from "@/types/plex.types";
// Plex has updated PMS so that libraries using stored track progress now complete at 99% officially.
const TRACK_COMPLETE_PERCENT = 0.99;

const trackPercentComplete = (offset: number, duration: number): number => {
  if (!offset || !duration) return 0;

  return offset / duration;
};

const trackIsStarted = (track: PlexTrack): boolean => {
  if (!track.viewOffset) return false;

  const percentComplete = trackPercentComplete(track.viewOffset, track.duration);
  if (percentComplete > 0) return true;
  return false;
};

export const trackIsComplete = (track: PlexTrack): boolean => {
  if (!track) return false;

  if (!track.viewOffset && track.viewCount && track.viewCount > 0) return true;

  const percentComplete = trackPercentComplete(track.viewOffset, track.duration);
  if (percentComplete >= TRACK_COMPLETE_PERCENT) return true;
  return false;
};

export const markTrackPlayed = async (track: PlexTrack): Promise<boolean> => {
  await PlexJavascriptApi.scrobble(track.ratingKey);
  return true;
};

export const markTrackUnplayed = async (track: PlexTrack): Promise<boolean> => {
  await PlexJavascriptApi.unscrobble(track.ratingKey);
  return true;
};

/**
 * On Deck - this is the first in progress or unplayed track that is encountered when
 * going through the tracks in order. Trying to mimic what Plex does with TV shows,
 * but for a single audio album.
 * @param {PlexAlbumMetadata} albumInfo - the album we are finding next track on
 * @returns {PlexTrack} - the determined next track to play.
 */
export const findOnDeck = (albumInfo: PlexAlbumMetadata): PlexTrack => {
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

export const isTrackOnDeck = (track: PlexTrack, album: PlexAlbumMetadata): boolean => {
  const onDeck = findOnDeck(album);
  if (onDeck.key !== track.key) return false;
  return true;
};

export const updateOnDeck = (track: PlexTrack, album: PlexAlbumMetadata): Promise<boolean> => new Promise((resolve) => {
  // We need to queue up promises for all the tracks in the album
  // if they select a current track that was in progress, it will not be updated.
  const promises: Array<Promise<boolean>> = [];
  for (let i = 0; i < album.Metadata.length; i++) {
    const check = album.Metadata[i];
    if (track.index > check.index) {
      // previous tracks need to be marked as played
      promises.push(markTrackPlayed(check));
    } else if (track.index <= check.index) {
      // upcoming tracks should be marked as unplayed.
      promises.push(markTrackUnplayed(check));
    }
  }

  Promise.allSettled(promises)
    .then(() => {
      // promises have been settled
      resolve(true);
    });
});

// Generate album queue based on selected track.
export const getAlbumQueue = (track: PlexTrack, album: PlexAlbumMetadata): Array<any> => {
  const queue: Array<any> = [];
  for (let i = 0; i < album.Metadata.length; i++) {
    const check = album.Metadata[i];

    if (track.index <= check.index) {
      queue.push(check);
    }
  }

  return queue;
};