import React, { ReactElement } from 'react';
import styled from 'styled-components';

import PlexImage from '../util/PlexImage';

const Container = styled.div`
    overflow: hidden;
    text-align: center;
    display: flex;
    flex-direction: column;
`;
const AlbumCoverContainer = styled.div`
    margin-bottom: 0.25rem;
    overflow:hidden;
`;
const AlbumText = styled.div`
    font-weight: 500;
`;
const ArtistText = styled.div`
`;
type Props = {
    metadata: any,
    showAuthor?: boolean
}
function AlbumItem({ metadata, showAuthor }: Props): ReactElement {
  return (
    // <Link to={`/album/${metadata.ratingKey}`}>
      <Container>
        <AlbumCoverContainer>
          <PlexImage width={200} height={200} url={metadata.thumb} alt={`${metadata.title}`} isLazy />
        </AlbumCoverContainer>
        <AlbumText title={metadata.title}>{metadata.title}</AlbumText>
        {showAuthor && (
        <ArtistText title={metadata.parentTitle}>{metadata.parentTitle}</ArtistText>
        )}
      </Container>
    // </Link>
  );
}

AlbumItem.defaultProps = {
  showAuthor: false,
};

export default AlbumItem;
