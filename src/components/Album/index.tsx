import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, useParams } from 'react-router-dom';

import { useAppSelector, useAppDispatch } from '../../context/hooks';
import { setPlayQueue } from "../../context/actions/playQueueActions";

import { getAlbumMetadata } from '../../plex/Api';
import { getAlbumQueue, updateOnDeck, isTrackOnDeck, findOnDeck } from '../../plex/Playback';

import OnDeckPlaySvg from '-!svg-react-loader!../../assets/onDeckPlay.svg';

import AlbumSummary from './AlbumSummary';
import AlbumItem from './AlbumItem';
import * as Responsive from '../util/responsive';

import PlexImage from '../util/PlexImage';

const Container = styled.div`
`;
const AlbumContainer = styled.div`
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
    margin-top: .5rem;
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

    border-top: solid 1px ${({ theme }) => theme.CONTAINER_BORDER};
    padding-top: .8rem;
`;
const TrackCount = styled.div`
    margin-bottom: 0.5rem;
`;

const Album = () => {

    const dispatch = useAppDispatch();

    const accessToken = useAppSelector(state => state.settings.accessToken);
    const baseUrl = useAppSelector(state => state.application.baseUrl);

    const [album, setAlbum]: [any, any] = useState({ Metadata: [] });
    const [onDeck, setOnDeck]: [any, any] = useState(null);

    const { ratingKey } = useParams();

    const playOnDeckTrack = (trackInfo) => {
        dispatch(setPlayQueue(getAlbumQueue(trackInfo, album)));
    }

    const playSelectedTrack = async (trackInfo: any) => {
        if (baseUrl && accessToken && !isTrackOnDeck(trackInfo, album)) {
            await updateOnDeck(trackInfo, album, baseUrl, accessToken);
            const albumInfo: any = await fetchAlbumMetadata();
            dispatch(setPlayQueue(getAlbumQueue(albumInfo.track, albumInfo.album)));
        }
        else
            playOnDeckTrack(trackInfo);
    }

    const fetchAlbumMetadata = async () => {
        if (baseUrl && accessToken && ratingKey) {
            const data: any = await getAlbumMetadata(baseUrl, ratingKey, { "X-Plex-Token": accessToken });
            if (data.MediaContainer) {
                const onDeck: any = findOnDeck(data.MediaContainer);
                setAlbum(data.MediaContainer);
                setOnDeck(onDeck);

                return { album: data.MediaContainer, track: onDeck };
            }
        }
        return null;
    }

    useEffect(() => {
        const fetchMetadata = async () => {
            if (accessToken && baseUrl && ratingKey)
                fetchAlbumMetadata();
        }
        fetchMetadata();
    }, [baseUrl, accessToken, ratingKey]);

    //https://tailwindcomponents.com/component/button-component-default
    return (
        <>
        {accessToken && (
        <>
        <Container>
            <AlbumContainer>
                <PlexImage width={200} height={200} url={album.thumb} alt={`${album.parentTitle} Cover`} />
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
                    {album.Metadata.map((track: any) => (
                        <AlbumItem key={track.key} trackInfo={track} playSelectedTrack={playSelectedTrack} updateAlbumInfo={fetchAlbumMetadata} />
                    ))}
                </Tracks>
            </TrackContainer>
        </Container>
        </>
        )}
        </>
    ); 
};

export default Album;