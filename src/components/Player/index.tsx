import React, { useEffect, useState, ReactElement } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { useAppSelector } from '../../context/hooks';

import * as Responsive from '../util/responsive';
import { PLAYER_HEIGHT } from '../util/global';
import PlexImage from '../util/PlexImage';
import PlayerTime from './controls/PlayerTime';
import AudioPlayer from './AudioPlayer';

const Container: any = styled.div`
    display: ${(props: any) => ((props.show) ? 'flex' : 'none')};
    height: ${(props: any) => ((props.show) ? PLAYER_HEIGHT : '0px')};

    flex-direction: row;
    flex-wrap: nowrap;
    flex-grow: 0;
    align-items: center;
    justify-content: space-evenly;
    
    color: ${({ theme }) => theme.PLAYER_TEXT};
    background-color: ${({ theme }) => theme.PLAYER_BACKGROUND};
`;
const AlbumImageContainer = styled.div`
    display: none;
    ${Responsive.smallMediaQuery(`
        display: block;
    `)}
`;
const InfoContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: .2rem;

    margin-left: 0.45rem;
    margin-right: 0.45rem;
    max-width: 120px; 

    ${Responsive.mediumMediaQuery(`
        margin-left: 0.75rem;
        margin-right: 0.75rem;
        max-width: 180px; 
    `)}
    
`;

const TextBlock = styled.div`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: ${(props) => props.theme.PLAYER_TEXT};
`;

const TextBlockMuted = styled(TextBlock)`
    color: ${(props) => props.theme.PLAYER_TEXT_MUTED};
`;

function NowPlaying(): ReactElement {
  const playState = useAppSelector((state) => state.player.mode);
  const currentTrack = useAppSelector((state) => state.playQueue.currentTrack);

  const [trackThumbUrl, setTrackThumbUrl]: [any, any] = useState(null);
  const [trackTitle, setTrackTitle] = useState('');
  const [albumTitle, setAlbumTitle] = useState('');
  const [albumKey, setAlbumKey] = useState('');
  const [artistName, setArtistName] = useState('');

  useEffect(() => {
    if (currentTrack) {
      setTrackThumbUrl(currentTrack.thumb);
      setTrackTitle(currentTrack.title);
      setAlbumTitle(currentTrack.parentTitle);
      setAlbumKey(currentTrack.parentRatingKey);
      setArtistName(currentTrack.grandparentTitle);
    } else {
      setTrackThumbUrl(null);
      setTrackTitle('');
      setAlbumTitle('');
      setAlbumKey('');
      setArtistName('');
    }
  }, [currentTrack]);

  return (
    <Container show={(playState !== 'stopped')}>
      <AlbumImageContainer>
        <PlexImage width={100} height={100} url={trackThumbUrl} alt={trackTitle} hideRadius />
      </AlbumImageContainer>
      <InfoContainer>
        <TextBlock>{trackTitle}</TextBlock>
        <TextBlockMuted>
          <Link href={'/album/[ratingKey]'} as={`/album/${albumKey}`}>
            {albumTitle}
          </Link>
        </TextBlockMuted>
        <TextBlockMuted>{artistName}</TextBlockMuted>
        <PlayerTime />
      </InfoContainer>
      <AudioPlayer />
    </Container>
  );
}

export default NowPlaying;
