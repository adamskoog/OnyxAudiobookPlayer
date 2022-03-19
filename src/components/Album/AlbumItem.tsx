import React, { useEffect } from 'react';
import styled from 'styled-components';

import { useAppSelector } from '../../context/hooks';

import { formatTrackDisplay } from '../../utility/time';
import { trackIsComplete } from '../../plex/Playback';

import TrackMenu from './TrackMenu';

import TrackCompleteSvg from '-!svg-react-loader!../../assets/trackComplete.svg';
import TrackInProgressSvg from '-!svg-react-loader!../../assets/trackInProgress.svg';
import TrackUnplayedSvg from '-!svg-react-loader!../../assets/trackUnplayed.svg';

const trackStatus = (trackInfo: any): string => {
  if (trackInfo.viewOffset || trackInfo.viewCount) {
    if (trackIsComplete(trackInfo)) {
      return 'complete';
    }
    return 'in-progress';
  }
  return '';
};

const TrackCell = styled.div``;

type Props = {
    trackInfo: any,
    playSelectedTrack: any,
    updateAlbumInfo: any
}

function AlbumItem({ trackInfo, playSelectedTrack, updateAlbumInfo }: Props) {
  const currentTrack = useAppSelector((state) => state.playQueue.currentTrack);

  useEffect(() => {
    if (currentTrack && trackInfo) {
      if (currentTrack.key === trackInfo.key) {
        updateAlbumInfo();
      }
    }
  }, [currentTrack]);

  return (
    <>
      <TrackCell>
        {/* TODO: Refactor to component */}
        {trackStatus(trackInfo) === '' && (<TrackUnplayedSvg />)}
        {trackStatus(trackInfo) === 'in-progress' && (<TrackInProgressSvg />)}
        {trackStatus(trackInfo) === 'complete' && (<TrackCompleteSvg />)}
      </TrackCell>
      <TrackCell>{trackInfo.index}</TrackCell>
      <TrackCell>{trackInfo.title}</TrackCell>
      <TrackCell>{formatTrackDisplay(trackInfo.duration)}</TrackCell>
      <TrackCell>
        <TrackMenu
          trackInfo={trackInfo}
          playSelectedTrack={playSelectedTrack}
          updateAlbumInfo={updateAlbumInfo}
        />
      </TrackCell>
    </>
  );
}

export default AlbumItem;
