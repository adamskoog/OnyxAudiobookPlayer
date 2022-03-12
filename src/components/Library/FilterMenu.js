import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';

import { ReactComponent as ChevronDownArrow } from '../../assets/chevronDownArrow.svg';
import { SORT_ORDER, MUSIC_LIBRARY_DISPAY_TYPE } from '../../plex/Api';

import { setLibrarySortOrder, setLibraryDisplayType } from '../../context/actions/libraryActions';

import Subheader from '../Header/Subheader';
import Menu from '../Menu';


const FilterItem = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: .5rem;

    position: relative;
`;

const FilterText = styled.span`
`;
const FilterButton = styled.button`
    fill: #ffffff;

    overflow: hidden;
    transform: rotate(0deg);
    transition: all 0.2s ease-out;
    transform: ${(props) => (props.showRotate ? 'rotate(180deg)' : '')};

    &:focus {
        outline: none;
    }
`;

const FilterMenu = () => {
    const dispatch = useDispatch();

    const displayType = useSelector(state => state.library.displayType);
    const sortType = useSelector(state => state.library.sortType);

    const [displayMenuIsOpen, setDisplayMenuIsOpen] = useState(false);
    const displayMenuItems = [
        { title: MUSIC_LIBRARY_DISPAY_TYPE.artist.title, callback: () => dispatch(setLibraryDisplayType(MUSIC_LIBRARY_DISPAY_TYPE.artist.title)) },
        { title: MUSIC_LIBRARY_DISPAY_TYPE.album.title, callback: () => dispatch(setLibraryDisplayType(MUSIC_LIBRARY_DISPAY_TYPE.album.title)) }
    ];

    const [sortMenuIsOpen, setSortMenuIsOpen] = useState(false);
    const sortMenuItems = [
        { title: SORT_ORDER.ascending, callback: () => dispatch(setLibrarySortOrder(SORT_ORDER.ascending)) },
        { title: SORT_ORDER.descending, callback: () => dispatch(setLibrarySortOrder(SORT_ORDER.descending)) }
    ];

    useEffect(() => {
        if (!displayMenuIsOpen) return;

        const closeMenu = () => {
            if (displayMenuIsOpen) setDisplayMenuIsOpen(false);
        }

        document.addEventListener("click", closeMenu);
        return () => { document.removeEventListener("click", closeMenu); }
    }, [displayMenuIsOpen]);

    useEffect(() => {
        if (!sortMenuIsOpen) return; 

        const closeMenu = () => {
            if (sortMenuIsOpen) setSortMenuIsOpen(false);
        }

        document.addEventListener("click", closeMenu);
        return () => { document.removeEventListener("click", closeMenu); }
    }, [sortMenuIsOpen]);

    return (
        <Subheader>
            <FilterItem>
                <FilterText>Display: {displayType}</FilterText>
                <FilterButton showRotate={displayMenuIsOpen} onClick={() => setDisplayMenuIsOpen(!displayMenuIsOpen)} id="display-menu" aria-haspopup="true"><ChevronDownArrow /></FilterButton>
                <Menu isOpen={displayMenuIsOpen} labelledby={'display-menu'} children={displayMenuItems} vOffset={'2rem'}/>
            </FilterItem>
            <FilterItem>
                <FilterText>Order: {sortType}</FilterText>
                <FilterButton showRotate={sortMenuIsOpen} onClick={() => setSortMenuIsOpen(!sortMenuIsOpen)} id="sort-order-menu" aria-haspopup="true"><ChevronDownArrow /></FilterButton>
                <Menu isOpen={sortMenuIsOpen} labelledby={'sort-order-menu'} children={sortMenuItems} vOffset={'2rem'} />
            </FilterItem>
        </Subheader>
    ); 
}

export default FilterMenu;
