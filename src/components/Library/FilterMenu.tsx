import React, { useEffect, useState, ReactElement } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';

import { useAppSelector, useAppDispatch } from '../../context/hooks';

import ChevronDownArrow from '-!svg-react-loader!../../assets/chevronDownArrow.svg';
import { SORT_ORDER, MUSIC_LIBRARY_DISPAY_TYPE } from '../../plex/Api';

import { setLibrarySortOrder, setLibraryDisplayType } from '../../context/actions/libraryActions';

import Subheader from '../Header/Subheader';
import Menu from '../Menu';

const FilterItem = styled.div`
    display: flex;
    justify-content: flex-end;

    position: relative;
`;

const FilterText = styled.span`
    margin-right: .5rem;
`;
const FilterButton: any = styled.button`
    fill: ${({ theme }) => theme.SUBHEADER_TEXT};

    overflow: hidden;
    transform-origin: center;
    transform: rotate(0deg);
    transition: all 0.2s ease-out;
    transform: ${(props: any) => (props.showRotate ? 'rotate(180deg)' : '')};

    &:focus {
        outline: none;
    }
`;

function FilterMenu(): ReactElement {
  const dispatch = useAppDispatch();

  const router = useRouter();
  const pathname = router.pathname;

  const displayType = useAppSelector((state) => state.library.displayType);
  const sortType = useAppSelector((state) => state.library.sortType);

  const [displayMenuIsOpen, setDisplayMenuIsOpen] = useState(false);
  const displayMenuItems = [
    { title: MUSIC_LIBRARY_DISPAY_TYPE.artist.title, callback: () => dispatch(setLibraryDisplayType(MUSIC_LIBRARY_DISPAY_TYPE.artist.title)) },
    { title: MUSIC_LIBRARY_DISPAY_TYPE.album.title, callback: () => dispatch(setLibraryDisplayType(MUSIC_LIBRARY_DISPAY_TYPE.album.title)) },
  ];

  const [sortMenuIsOpen, setSortMenuIsOpen] = useState(false);
  const sortMenuItems = [
    { title: SORT_ORDER.ascending, callback: () => dispatch(setLibrarySortOrder(SORT_ORDER.ascending)) },
    { title: SORT_ORDER.descending, callback: () => dispatch(setLibrarySortOrder(SORT_ORDER.descending)) },
  ];

  useEffect(() => {
    if (!displayMenuIsOpen) return;

    const closeMenu = (): void => {
      if (displayMenuIsOpen) setDisplayMenuIsOpen(false);
    };

    document.addEventListener('click', closeMenu);
    return () => { document.removeEventListener('click', closeMenu); };
  }, [displayMenuIsOpen]);

  useEffect(() => {
    if (!sortMenuIsOpen) return;

    const closeMenu = (): void => {
      if (sortMenuIsOpen) setSortMenuIsOpen(false);
    };

    document.addEventListener('click', closeMenu);
    return () => { document.removeEventListener('click', closeMenu); };
  }, [sortMenuIsOpen]);

  return (
    <Subheader>
      {pathname === '/library' && (
        <>
          <FilterItem>
            <FilterText>
              Display:
              {displayType}
            </FilterText>
            <FilterButton showRotate={displayMenuIsOpen} onClick={() => setDisplayMenuIsOpen(!displayMenuIsOpen)} id="display-menu" aria-haspopup="true"><ChevronDownArrow /></FilterButton>
            <Menu isOpen={displayMenuIsOpen} labelledby="display-menu" vOffset="2rem">
              {displayMenuItems}
            </Menu>
          </FilterItem>
          <FilterItem>
            <FilterText>
              Order:
              {sortType}
            </FilterText>
            <FilterButton showRotate={sortMenuIsOpen} onClick={() => setSortMenuIsOpen(!sortMenuIsOpen)} id="sort-order-menu" aria-haspopup="true"><ChevronDownArrow /></FilterButton>
            <Menu isOpen={sortMenuIsOpen} labelledby="sort-order-menu" vOffset="2rem">
              {sortMenuItems}
            </Menu>
          </FilterItem>
        </>
      )}
    </Subheader>
  );
}

export default FilterMenu;
