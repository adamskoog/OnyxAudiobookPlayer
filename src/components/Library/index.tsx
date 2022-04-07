import React, { useEffect, ReactElement, useContext } from 'react';
import styled from 'styled-components';

import { useAppSelector, useAppDispatch } from '../../context/hooks';
import * as Responsive from '../util/responsive';

import Loader from '../Loader';
import AlbumItem from './AlbumItem';
import ArtistItem from './ArtistItem';

import { fetchLibraryItems } from '../../context/actions/libraryActions';
import { MUSIC_LIBRARY_DISPAY_TYPE } from '../../plex/Api';
import { usePatchesInScope } from 'immer/dist/internal';

import VirtualGrid from '../VirtualGrid';
import { ScrollerRefContext } from '../Layout';

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

function GridChild({ style, index, type, items, readyInViewport, scrolling }: any): ReactElement {

    const item = items[index];
    return (
      <div style={{ ...style }}>
        {type === MUSIC_LIBRARY_DISPAY_TYPE.album.title &&          
            <AlbumItem key={item.key} metadata={item} showAuthor />
        }
        {type === MUSIC_LIBRARY_DISPAY_TYPE.artist.title &&          
            <ArtistItem key={item.key} metadata={item} />
        }
      </div>
    );
};


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

  const containerRef: any = useContext(ScrollerRefContext);

  useEffect(() => {
    if (applicationState === 'ready' && librarySection) {
      dispatch(fetchLibraryItems());
    }
  }, [applicationState, librarySection, displayType, sortType]);

  return (
    <>
      <Loader isLoading={isLoading} zIndex={45} />
      {!user && (
      <ErrorMessage>Must login to view library.</ErrorMessage>
      )}
      {user && !loading && (libraryItems.length > 0) && (
          <VirtualGrid
            total={libraryItems.length}
            cell={{ height: 255, width: 210 }}
            child={GridChild}
            childProps={{ type: displayType, items: libraryItems }}
            viewportRowOffset={10}
            scrollContainer={containerRef.ref.current}
          />
      )}
    </>
  );
}

export default Library;
