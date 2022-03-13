import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { getAlbumMetadata, getThumbnailTranscodeUrl } from '../../plex/Api';

import Subheader from '../Header/Subheader';
import AlbumItem from '../Library/AlbumItem';

import { ScrollContent  } from '../util/container';
import * as Responsive from '../util/responsive';

const Container = styled.div`
    display: flex;
    gap: 1.75rem;
`;
const ArtistImage = styled.img`
    height: 200px;
    width: 200px;
    display: inline-block;
    border-radius: 0.375rem;
`;
const ArtistInfo = styled.div`
    flex-grow: 1;

    display: flex;
    flex-direction: column;
    gap: .5rem;
`;
const ArtistName = styled.div`
    margin-top: .25rem;

    font-size: 1.5rem;
    line-height: 1.125rem;
`;

const ArtistSummary = styled.div`
    margin-top: 2rem;
    max-width: 600px;

    font-size: 1.25rem;
    line-height: 1.125rem;
`;

const AlbumContainer = styled.div`
    margin-top: 4rem;
`;
const Albums = styled.div`
    display: grid;
    grid-gap: 1rem;
    gap: 1rem;
    align-items: center;
    justify-items: center;

    grid-template-columns: repeat(2, minmax(0, 1fr));

    ${Responsive.smallMediaQuery(`
        grid-template-columns: repeat(3, minmax(0, 1fr));
    `)}
    ${Responsive.mediumMediaQuery(`
        grid-template-columns: repeat(4, minmax(0, 1fr));;
    `)}
    ${Responsive.largeMediaQuery(`
        grid-template-columns: repeat(5, minmax(0, 1fr));
    `)}
    ${Responsive.xlMediaQuery(`
        grid-template-columns: repeat(6, minmax(0, 1fr));
    `)}
`;
const AlbumCount = styled.div`
    margin-bottom: 0.5rem;
`;


const Artist = () => {

    //const authToken = useSelector(state => state.application.authToken);
    const currentServer = useSelector(state => state.settings.currentServer);
    const authToken = currentServer.accessToken;
    const baseUrl = useSelector(state => state.application.baseUrl);

    const [artist, setArtist] = useState({ Metadata: [] });

    const { ratingKey } = useParams();

    const fetchArtistMetadata = async () => {
        const data = await getAlbumMetadata(baseUrl, ratingKey, { "X-Plex-Token": authToken });
        if (data.MediaContainer) {
            setArtist(data.MediaContainer);
        }
    }

    useEffect(() => {
        const fetchMetadata = async () => {
            if (authToken && baseUrl && ratingKey)
                fetchArtistMetadata();
        }
        fetchMetadata();
    }, [baseUrl, authToken, ratingKey]);

    return (
        <>
        {authToken && (
        <>
        <Subheader></Subheader>
        <ScrollContent>
            <Container>
                <ArtistImage src={getThumbnailTranscodeUrl(200, 200, baseUrl, artist.thumb, authToken)} alt={artist.parentTitle} />
                <ArtistInfo>
                    <ArtistName>{artist.parentTitle}</ArtistName>
                    <ArtistSummary>{artist.summary}</ArtistSummary>
                </ArtistInfo>
            </Container>
            <AlbumContainer>
                <AlbumCount>{artist.size} Album{(artist.size > 1) ? "s" : ""}</AlbumCount>
                <Albums>
                    {artist.Metadata.map((album) => (
                        <AlbumItem key={album.key} metadata={album} />
                    ))}
                </Albums>
            </AlbumContainer>
        </ScrollContent>
        </>
        )}
        </>
    ); 
};

export default Artist;