import React, { useEffect, ReactElement } from 'react';
import styled from 'styled-components';

import { useAppSelector, useAppDispatch } from '../../context/hooks';
import * as Responsive from '../util/responsive';

import Loader from '../Loader';
import AlbumItem from './AlbumItem';
import ArtistItem from './ArtistItem';

import { fetchLibraryItems } from '../../context/actions/libraryActions';
import { MUSIC_LIBRARY_DISPAY_TYPE } from '../../plex/Api';
import { usePatchesInScope } from 'immer/dist/internal';

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

function Library(): ReactElement {
  const dispatch = useAppDispatch();

  const loading = useAppSelector((state) => state.library.isLoading);
  const libraryItems = useAppSelector((state) => state.library.items);
  const displayType = useAppSelector((state) => state.library.displayType);
  const sortType = useAppSelector((state) => state.library.sortType);

  const user = useAppSelector((state) => state.application.user);
  const applicationState = useAppSelector((state) => state.application.applicationState);
  const librarySection = useAppSelector((state) => state.settings.librarySection);
  const isLoading = useAppSelector((state) => state.library.isLoading);

  useEffect(() => {
    if (user && applicationState === 'ready' && librarySection) {
      dispatch(fetchLibraryItems());
    }
  }, [user, applicationState, librarySection, displayType, sortType]);

  return (
    <>
      <Loader isLoading={isLoading} zIndex={45} />
      {!user && (
      <ErrorMessage>Must login to view library.</ErrorMessage>
      )}
      {user && !loading && (
      <Grid>
        {(displayType === MUSIC_LIBRARY_DISPAY_TYPE.album.title) && (libraryItems.map((item: any) => (
          <AlbumItem key={item.key} metadata={item} showAuthor />
        )))}
        {(displayType === MUSIC_LIBRARY_DISPAY_TYPE.artist.title) && (libraryItems.map((item: any) => (
          <ArtistItem key={item.key} metadata={item} />
        )))}
      </Grid>
      )}
    </>
  );
}

export default Library;
