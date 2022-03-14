import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { getAlbumMetadata } from '../../plex/Api';

import Subheader from '../Header/Subheader';
import AlbumItem from '../Library/AlbumItem';
import AlbumSummary from '../Album/AlbumSummary';

import { ScrollContent  } from '../util/container';
import * as Responsive from '../util/responsive';
import PlexImage from '../util/PlexImage';

const Container = styled.div`
    display: flex;
    gap: 1.75rem;

    flex-direction: column;
    justify-content: center;
    align-items: flex-start;

    ${Responsive.smallMediaQuery(`
        flex-direction: row;
        align-items: stretch;
    `)}
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

const AlbumContainer = styled.div`
    ${Responsive.smallMediaQuery(`
        margin-top: 3rem;
    `)}
`;
const Albums = styled.div`
    display: grid;
    grid-gap: 1rem;
    gap: 1rem;
    align-items: start;
    justify-items: center;

    border-top: solid 1px ${({ theme }) => theme.CONTAINER_BORDER};;
    padding-top: .8rem;

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

    const accessToken = useSelector(state => state.settings.accessToken);
    const baseUrl = useSelector(state => state.application.baseUrl);

    const [artist, setArtist] = useState({ Metadata: [] });

    const { ratingKey } = useParams();

    useEffect(() => {
        const fetchMetadata = async () => {
            if (accessToken && baseUrl && ratingKey) {
                const data = await getAlbumMetadata(baseUrl, ratingKey, { "X-Plex-Token": accessToken });
                if (data.MediaContainer) {
                    setArtist(data.MediaContainer);
                }
            }
        }
        fetchMetadata();
    }, [baseUrl, accessToken, ratingKey]);

    return (
        <>
        {accessToken && (
        <>
        <Subheader></Subheader>
        <ScrollContent>
            <Container>
                <PlexImage width={200} height={200} url={artist.thumb} alt={`${artist.parentTitle}`} />
                <ArtistInfo>
                    <ArtistName>{artist.parentTitle}</ArtistName>
                    <AlbumSummary summary={artist.summary} />
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