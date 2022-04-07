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
`;
const ArtistImageContainer = styled.div`
    margin-bottom: 0.25rem;
    overflow: hidden;
`;
const ArtistText = styled.div`
    padding-bottom: 1px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
`;

type Props = {
    metadata: any
}

function ArtistItem({ metadata }: Props): ReactElement {
  return (
    <Link href={'/artist/[ratingKey]'} as={`/artist/${metadata.ratingKey}`}>
      <Container>
        <ArtistImageContainer>
          <PlexImage width={200} height={200} url={metadata.thumb} alt={`${metadata.title}`} isLazy />
        </ArtistImageContainer>
        <ArtistText title={metadata.title}>{metadata.title}</ArtistText>
      </Container>
    </Link>
  );
}

export default ArtistItem;
