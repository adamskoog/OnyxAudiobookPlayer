import PlexJavascriptApi from '@adamskoog/jsapi-for-plex';
import type { PlexTrack } from '@adamskoog/jsapi-for-plex/plex.types';
// Plex has updated PMS so that libraries using stored track progress now complete at 99% officially.
const TRACK_COMPLETE_PERCENT = 0.99;

export const RESOURCETYPES = {
  server: 'server',
};

export const LIBRARYTYPES = {
  music: 'artist',
};

export const MUSIC_LIBRARY_DISPAY_TYPE = {
  artist: { title: 'Author', key: 8 },
  album: { title: 'Book', key: 9 },
  collection: { title: 'Collection', key: 18 }
};

export const SORT_ORDER = {
  ascending: 'Ascending',
  descending: 'Decending',
};

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
  try {
    // Empty response is generated on success - handle better?
    await PlexJavascriptApi.scrobble(track.ratingKey);
  } catch {}
  return true;
};

export const markTrackUnplayed = async (track: PlexTrack): Promise<boolean> => {
  try {
    await PlexJavascriptApi.unscrobble(track.ratingKey);
  } catch {}
  return true;
};

/**
 * On Deck - this is the first in progress or unplayed track that is encountered when
 * going through the tracks in order. Trying to mimic what Plex does with TV shows,
 * but for a single audio album.
 * @returns {PlexTrack} - the determined next track to play.
 */
export const findOnDeck = (tracks: PlexTrack[]): PlexTrack => {
  for (let i = 0; i < tracks.length; i++) {
    const track = tracks[i];

    // Track is Started, but not finished, we found On Deck
    if (trackIsStarted(track) && !trackIsComplete(track)) return track;

    // Is previous Track complete and current track not started, we found On Deck
    const prevTrack = tracks[i - 1];
    if (prevTrack) {
      if (trackIsComplete(prevTrack) && !trackIsComplete(track) && !trackIsStarted(track)) return track;
    }
  }

  // No tracks in progress, return first track.
  return tracks[0];
};

export const isTrackOnDeck = (track: PlexTrack, tracks: PlexTrack[]): boolean => {
  const onDeck = findOnDeck(tracks);
  if (onDeck.key !== track.key) return false;
  return true;
};

export const updateOnDeck = (track: PlexTrack, tracks: PlexTrack[]): Promise<boolean> => new Promise((resolve) => {
  // We need to queue up promises for all the tracks in the album
  // if they select a current track that was in progress, it will not be updated.
  const promises: Array<Promise<boolean>> = [];
  for (let i = 0; i < tracks.length; i++) {
    const check = tracks[i];
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
export const getAlbumQueue = (track: PlexTrack, tracks: PlexTrack[]): PlexTrack[] => {
  const queue: PlexTrack[] = [];
  for (let i = 0; i < tracks.length; i++) {
    const check = tracks[i];

    if (track.index <= check.index) {
      queue.push(check);
    }
  }

  return queue;
};

// TODO: this whole thing needs to be cleaned up and refactored. It's really rough.
export const createLibrarySortQuery = ({ order, display }: any): any => {
      const args: any = {};
    
      // Set the default value for display
      if (!display) args.type = MUSIC_LIBRARY_DISPAY_TYPE.album.key;
      else if (display === MUSIC_LIBRARY_DISPAY_TYPE.collection.title) args.type = MUSIC_LIBRARY_DISPAY_TYPE.collection.key;
      else if (display === MUSIC_LIBRARY_DISPAY_TYPE.album.title) args.type = MUSIC_LIBRARY_DISPAY_TYPE.album.key;
      else args.type = MUSIC_LIBRARY_DISPAY_TYPE.artist.key;
    
      if (!order) {
      // set a default order based on the album type.
        if (args.type === MUSIC_LIBRARY_DISPAY_TYPE.album.key) args.order = 'artist.titleSort,album.titleSort,album.index,album.id,album.originallyAvailableAt';
        else args.order = 'titleSort';
      } else {
        let desc = '';
        if (order === SORT_ORDER.descending) desc = ':desc';
        if (args.type === MUSIC_LIBRARY_DISPAY_TYPE.album.key) args.order = `artist.titleSort${desc},album.titleSort,album.index,album.id,album.originallyAvailableAt`;
        else args.order = `titleSort${desc}`;
      }
    
      return args;
};