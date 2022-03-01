import React from 'react';
import styled from 'styled-components';

import { Link } from 'react-router-dom';
import PlexApi from '../../plex/Api';

const Container = styled.div`
    max-width: 200px; /* Match max width of images to keep text aligned. */
    text-align: center;
`;

const AlbumCover = styled.img`
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    border-radius: 0.375rem;
    margin-bottom: 0.25rem;
`;

const OverflowText = styled.div`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const LibraryItem = ({ albumInfo, baseUrl, userInfo }) => {
    return (
        <Container>
            <Link to={`/album/${albumInfo.ratingKey}`}>
                <AlbumCover src={PlexApi.getThumbnailTranscodeUrl(200, 200, baseUrl, albumInfo.thumb, userInfo.authToken)} alt="Album Cover" loading="lazy" />
                <OverflowText title={albumInfo.title}>{albumInfo.title}</OverflowText>
                <OverflowText title={albumInfo.parentTitle}>{albumInfo.parentTitle}</OverflowText>
            </Link>
        </Container>
    ); 
}

export default LibraryItem;
