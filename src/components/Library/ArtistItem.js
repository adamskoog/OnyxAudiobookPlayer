import React from 'react';
import styled from 'styled-components';

import { Link } from 'react-router-dom';
import PlexImage from '../util/PlexImage';

const Container = styled.div`
    overflow: hidden;
    text-align: center;
    display: flex;
    flex-direction: column;
`;
const ArtistImageContainer = styled.div`
    margin-bottom: 0.25rem;
    overflow:hidden;
`;
const ArtistText = styled.div``;

const ArtistItem = ({ metadata }) => {
    return (
        <Link to={`/artist/${metadata.ratingKey}`}>
            <Container>
                <ArtistImageContainer>
                    <PlexImage width={200} height={200} url={metadata.thumb} alt={`${metadata.title}`} isLazy={true} />
                </ArtistImageContainer>
                <ArtistText title={metadata.title}>{metadata.title}</ArtistText>
            </Container>
        </Link>
    ); 
}

export default ArtistItem;
