import React, { useState, useEffect, ReactElement } from 'react';
import Link from 'next/link';
import styled from 'styled-components';

import { useAppSelector, useAppDispatch } from '../../context/hooks';
import { setPlayQueue } from '../../context/actions/playQueueActions';

import { PlexServerApi } from '../../plex/Api';
import {
  getAlbumQueue, updateOnDeck, isTrackOnDeck, findOnDeck,
} from '../../plex/Playback';

import OnDeckPlaySvg from '-!svg-react-loader!../../assets/onDeckPlay.svg';

import AlbumSummary from './AlbumSummary';
import AlbumItem from './AlbumItem';
import * as Responsive from '../util/responsive';

import PlexImage from '../util/PlexImage';

const Container = styled.div`
`;
const AlbumContainer = styled.div`
    display: flex;
    gap: 1.75rem;

    flex-direction: column;
    justify-content: center;
    align-items: flex-start;

    ${Responsive.smallMediaQuery(`
        flex-direction: row;
        align-items: stretch;
    `)}
`;
const AlbumInfo = styled.div`
    flex-grow: 1;

    display: flex;
    flex-direction: column;
    gap: .5rem;
`;
const AlbumTitle = styled.div`
    margin-top: .25rem;

    font-size: 1.25rem;
    line-height: 1.125rem;
`;
const AlbumAuthor = styled.div`
    margin-top: .25rem;

    font-size: 1.125rem;
    line-height: 1.125rem;
    cursor: pointer;
`;
const AlbumYear = styled.div`
    margin-top: .25rem;
    flex-grow: 1;
`;
const OnDeck = styled.div`
    margin-top: .5rem;
`;
const OnDeckButton = styled.button`
    vertical-align: middle;
    padding-right: 0.75rem;
    font-size: 1.875rem;
    line-height: 2.25rem;
`;

const TrackContainer = styled.div`
`;
const Tracks = styled.div`
    display: grid;
    grid-template-columns: 30px 30px auto 65px 30px;
    row-gap: .8rem;
    align-items: center;

    border-top: solid 1px ${({ theme }) => theme.CONTAINER_BORDER};
    padding-top: .8rem;
`;
const TrackCount = styled.div`
    margin-bottom: 0.5rem;
`;

type Props = {
  ratingKey: string
}
type FetchAlbumProps = {
  album: PlexAlbumMetadata,
  track: PlexTrack
}

function Album({ ratingKey }: Props): ReactElement {
  const dispatch = useAppDispatch();

  const applicationState = useAppSelector((state) => state.application.applicationState);

  const [album, setAlbum] = useState(null as PlexAlbumMetadata | null);
  const [onDeck, setOnDeck] = useState(null as PlexTrack | null);

  const playOnDeckTrack = (trackInfo: PlexTrack): void => {
    dispatch(setPlayQueue(getAlbumQueue(trackInfo, album)));
  };

  const fetchAlbumMetadata = async (): Promise<FetchAlbumProps | null> => {
    if (applicationState === 'ready' && ratingKey) {
        const albumInfo = await PlexServerApi.getAlbumMetadata(ratingKey);
        const newOnDeck = findOnDeck(albumInfo);

        setAlbum(albumInfo);
        setOnDeck(newOnDeck);

        return { album: albumInfo, track: newOnDeck };
    }
    return null;
  };

  const playSelectedTrack = async (trackInfo: PlexTrack): Promise<void> => {
    if (applicationState === 'ready' && !isTrackOnDeck(trackInfo, album)) {
      await updateOnDeck(trackInfo, album);
      const albumInfo = await fetchAlbumMetadata();
      if (albumInfo)
          dispatch(setPlayQueue(getAlbumQueue(albumInfo.track, albumInfo.album)));
    } else playOnDeckTrack(trackInfo);
  };

  useEffect(() => {
    const fetchMetadata = async (): Promise<void> => {
      if (applicationState === 'ready' && ratingKey) fetchAlbumMetadata();
    };
    fetchMetadata();
  }, [applicationState, ratingKey]);

  // https://tailwindcomponents.com/component/button-component-default
  return (
    <Container>
      {applicationState === 'ready' && album && (
        <>
          <AlbumContainer>
            <PlexImage width={200} height={200} url={album.thumb} alt={`${album.title} Cover`} />
            <AlbumInfo>
              <AlbumTitle>{album.title}</AlbumTitle>
              <Link href={'/artist/[ratingKey]'} as={`/artist/${album.parentRatingKey}`}>
                <AlbumAuthor>{album.parentTitle}</AlbumAuthor>
              </Link>
              <AlbumYear>{album.year}</AlbumYear>
              {onDeck && (
              <OnDeck>
                <OnDeckButton onClick={() => playOnDeckTrack(onDeck)}>
                  <OnDeckPlaySvg />
                </OnDeckButton>
                {onDeck.title}
              </OnDeck>
              )}
            </AlbumInfo>
          </AlbumContainer>
          <AlbumSummary summary={album.summary} />
          <TrackContainer>
            <TrackCount>
              {album.size}
              {' '}
              Track
              {(album.size > 1) ? 's' : ''}
            </TrackCount>
            <Tracks>
              {album.Metadata.map((track) => (
                <AlbumItem key={track.key} trackInfo={track} playSelectedTrack={playSelectedTrack} updateAlbumInfo={fetchAlbumMetadata} />
              ))}
            </Tracks>
          </TrackContainer>
        </>
      )}
    </Container>
  );
}

export default Album;
