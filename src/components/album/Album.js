import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux'
import { setPlayQueue } from "../../context/actions/playQueueActions";

import { getAlbumMetadata, getThumbnailTranscodeUrl } from '../../plex/Api';
import { getAlbumQueue, updateOnDeck, isTrackOnDeck, findOnDeck } from '../../plex/Playback';

import { ReactComponent as OnDeckPlaySvg } from '../../assets/onDeckPlay.svg';

import { ScrollContent  } from '../util/container';
import AlbumSummary from './AlbumSummary';
import AlbumItem from './AlbumItem';

const Container = styled.div`
`;
const AlbumContainer = styled.div`
    display: flex;
    gap: 1.75rem;
`;
const AlbumImage = styled.img`
    height: 200px;
    width: 200px;
    display: inline-block;
    border-radius: 0.375rem;
`;
const AlbumInfo = styled.div`
    flex-grow: 1;

    display: flex;
    flex-direction: column;
    gap: .5rem;
`;
const AlbumTitle = styled.div`
    margin-top: .25rem;

    font-size: 1.25rem;
    line-height: 1.125rem;
`;
const AlbumAuthor = styled.div`
    margin-top: .25rem;

    font-size: 1.125rem;
    line-height: 1.125rem;
`;
const AlbumYear = styled.div`
    margin-top: .25rem;
    flex-grow: 1;
`;
const OnDeck = styled.div`

`;
const OnDeckButton = styled.button`
    vertical-align: middle;
    padding-right: 0.75rem;
    font-size: 1.875rem;
    line-height: 2.25rem;
`;

const TrackContainer = styled.div`
`;
const Tracks = styled.div`
    display: grid;
    grid-template-columns: 30px 30px auto 65px 30px;
    row-gap: .8rem;
    align-items: center;

    border-top: solid 1px black;
    padding-top: .8rem;
`;
const TrackCount = styled.div`
    margin-bottom: 0.5rem;
`;

const Album = ({ ratingKey }) => {

    const dispatch = useDispatch();

    const authToken = useSelector(state => state.application.authToken);
    const baseUrl = useSelector(state => state.application.baseUrl);

    const [album, setAlbum] = useState({ Metadata: [] });
    const [onDeck, setOnDeck] = useState(null);

    const playOnDeckTrack = (trackInfo) => {
        dispatch(setPlayQueue(getAlbumQueue(trackInfo, album)));
    }

    const playSelectedTrack = async (trackInfo) => {
        if (!isTrackOnDeck(trackInfo, album)) {
            await updateOnDeck(trackInfo, album, baseUrl, authToken);
            const albumInfo = await fetchAlbumMetadata();
            dispatch(setPlayQueue(getAlbumQueue(albumInfo.track, albumInfo.album)));
        }
        else
            playOnDeckTrack(trackInfo);
    }

    const fetchAlbumMetadata = async () => {
        const data = await getAlbumMetadata(baseUrl, ratingKey, { "X-Plex-Token": authToken });
        if (data.MediaContainer) {
            const onDeck = findOnDeck(data.MediaContainer);
            setAlbum(data.MediaContainer);
            setOnDeck(onDeck);

            return { album: data.MediaContainer, track: onDeck };
        }
        return null;
    }

    useEffect(() => {
        const fetchMetadata = async () => {
            if (authToken && baseUrl && ratingKey)
                fetchAlbumMetadata();
        }
        fetchMetadata();
    }, [baseUrl, authToken, ratingKey]);

    //https://tailwindcomponents.com/component/button-component-default
    return (
        <>
        {authToken && (
        <ScrollContent>
        <Container>
            <AlbumContainer>
                <AlbumImage src={getThumbnailTranscodeUrl(200, 200, baseUrl, album.thumb, authToken)} alt="Album Cover" />
                <AlbumInfo>
                    <AlbumTitle>{album.parentTitle}</AlbumTitle>
                    <Link to={`/artist/${album.grandparentRatingKey}`}>
                        <AlbumAuthor>{album.grandparentTitle}</AlbumAuthor>
                    </Link>
                    <AlbumYear>{album.parentYear}</AlbumYear>
                    {onDeck && (
                    <OnDeck>
                        <OnDeckButton onClick={() => playOnDeckTrack(onDeck)}>
                            <OnDeckPlaySvg />
                        </OnDeckButton>
                        {onDeck.title}
                    </OnDeck>
                    )}
                </AlbumInfo>
            </AlbumContainer>
            <AlbumSummary summary={album.summary} />
            <TrackContainer>
                <TrackCount>{album.size} Track{(album.size > 1) ? "s" : ""}</TrackCount>
                <Tracks>
                    {album.Metadata.map((track) => (
                        <AlbumItem key={track.key} trackInfo={track} playSelectedTrack={playSelectedTrack} updateAlbumInfo={fetchAlbumMetadata} />
                    ))}
                </Tracks>
            </TrackContainer>
        </Container>
        </ScrollContent>
        )}
        </>
    ); 
};

export default Album;