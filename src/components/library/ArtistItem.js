import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

import { Link } from 'react-router-dom';
import { getThumbnailTranscodeUrl } from '../../plex/Api';

import { OverflowText } from '../util/common';

const Container = styled.div`
    max-width: 200px; /* Match max width of images to keep text aligned. */
    text-align: center;
`;

const AlbumCover = styled.img`
    aspect-ratio: 1/1;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    border-radius: 0.375rem;
    margin-bottom: 0.25rem;
`;

const ArtistItem = ({ metadata }) => {
    const user = useSelector(state => state.application.user);
    const baseUrl = useSelector(state => state.application.baseUrl);

    return (
        <Container>
            <Link to={`/artist/${metadata.ratingKey}`}>
                <AlbumCover src={getThumbnailTranscodeUrl(200, 200, baseUrl, metadata.thumb, user.authToken)} alt={metadata.title} loading="lazy" />
                <OverflowText title={metadata.title}>{metadata.title}</OverflowText>
            </Link>
        </Container>
    ); 
}

export default ArtistItem;
