import React, { ReactElement } from 'react';
import Link from 'next/link';
import styled from 'styled-components';

import PlexImage from '../util/PlexImage';

const Container = styled.div`
    overflow: hidden;
    text-align: center;
    display: flex;
    flex-direction: column;
    cursor: pointer;
    margin: 0 10px;
`;
const AlbumCoverContainer = styled.div`
    margin-bottom: 0.25rem;
    overflow:hidden;
`;
const AlbumText = styled.div`
    font-weight: 500;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
`;
const ArtistText = styled.div`
    padding-bottom: 1px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
`;
type Props = {
    metadata: any,
    showAuthor?: boolean
}
function AlbumItem({ metadata, showAuthor }: Props): ReactElement {
  return (
    <Link href={'/album/[ratingKey]'} as={`/album/${metadata.ratingKey}`}>
      <Container>
        <AlbumCoverContainer>
          <PlexImage width={200} height={200} url={metadata.thumb} alt={`${metadata.title}`} isLazy />
        </AlbumCoverContainer>
        <AlbumText title={metadata.title}>{metadata.title}</AlbumText>
        {showAuthor && (
        <ArtistText title={metadata.parentTitle}>{metadata.parentTitle}</ArtistText>
        )}
      </Container>
    </Link>
  );
}

AlbumItem.defaultProps = {
  showAuthor: false,
};

export default AlbumItem;
