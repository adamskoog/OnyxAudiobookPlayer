import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';

import * as Responsive from '../util/responsive';

import AlbumItem from './AlbumItem';
import ArtistItem from './ArtistItem';

import { fetchLibraryItems } from '../../context/actions/libraryActions';
import { MUSIC_LIBRARY_DISPAY_TYPE } from '../../plex/Api';

const ErrorMessage = styled.div`
    margin: 30px;
`;

const Grid = styled.div`
    display: grid;
    grid-gap: 1rem;
    gap: 1rem;
    align-items: start;
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

const Library = () => {
    const dispatch = useDispatch();

    const loading = useSelector(state => state.library.loading);
    const libraryItems = useSelector(state => state.library.items);
    const displayType = useSelector(state => state.library.displayType);
    const sortType = useSelector(state => state.library.sortType);

    const user = useSelector(state => state.application.user);
    const baseUrl = useSelector(state => state.application.baseUrl);
    const librarySection = useSelector(state => state.settings.librarySection);

    useEffect(() => {
        if (user && baseUrl && librarySection)
            dispatch(fetchLibraryItems());
    }, [user, baseUrl, librarySection, displayType, sortType]);

    return (
        <>
        {!user && (
            <ErrorMessage>Must login to view library.</ErrorMessage>
        )}
        {user && !loading && (
            <Grid>
                {(displayType === MUSIC_LIBRARY_DISPAY_TYPE.album.title) && (libraryItems.map((item) => (
                    <AlbumItem key={item.key} metadata={item} showAuthor={true} />
                )))}
                {(displayType === MUSIC_LIBRARY_DISPAY_TYPE.artist.title) && (libraryItems.map((item) => (
                    <ArtistItem key={item.key} metadata={item} />
                )))}
            </Grid>
        )}
        </>
    ); 
}

export default Library;
