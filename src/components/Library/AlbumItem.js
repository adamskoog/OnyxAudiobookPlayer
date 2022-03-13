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
const AlbumCoverContainer = styled.div`
    margin-bottom: 0.25rem;
    overflow:hidden;
`;
const AlbumText = styled.div`
    font-weight: 500;
`;
const ArtistText = styled.div`
`

const AlbumItem = ({ metadata, showAuthor }) => {
    return (
        <Link to={`/album/${metadata.ratingKey}`}>
            <Container>           
                <AlbumCoverContainer>
                    <PlexImage width={200} height={200} url={metadata.thumb} alt={`${metadata.title}`} isLazy={true} />
                </AlbumCoverContainer>
                <AlbumText title={metadata.title}>{metadata.title}</AlbumText>
                {showAuthor && (
                    <ArtistText title={metadata.parentTitle}>{metadata.parentTitle}</ArtistText>
                )}
            </Container>
        </Link>
    ); 
}

export default AlbumItem;
