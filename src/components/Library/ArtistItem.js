import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

import { Link } from 'react-router-dom';
import { getThumbnailTranscodeUrl } from '../../plex/Api';

import { OverflowText } from '../util/common';

const Container = styled.div`
    overflow: hidden;
    text-align: center;
    display: flex;
    flex-direction: column;
`;
const ArtistImageContainer = styled.div`
    aspect-ratio: 1/1;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    border-radius: 0.375rem;
    margin-bottom: 0.25rem;
    overflow:hidden;
`;
const ArtistImage = styled.img``;
const ArtistText = styled.div``;


const ArtistItem = ({ metadata }) => {
    const user = useSelector(state => state.application.user);
    const baseUrl = useSelector(state => state.application.baseUrl);

    return (
        <Link to={`/artist/${metadata.ratingKey}`}>
            <Container>
                <ArtistImageContainer>
                    <ArtistImage src={getThumbnailTranscodeUrl(200, 200, baseUrl, metadata.thumb, user.authToken)} alt={metadata.title} loading="lazy" />
                </ArtistImageContainer>
                <ArtistText title={metadata.title}>{metadata.title}</ArtistText>
            </Container>
        </Link>
    ); 
}

export default ArtistItem;
