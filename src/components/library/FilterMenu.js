import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';

import { ReactComponent as ChevronDownArrow } from '../../assets/chevronDownArrow.svg';
import { SORT_ORDER, MUSIC_LIBRARY_DISPAY_TYPE } from '../../plex/Api';

import { setLibrarySortOrder, setLibraryDisplayType } from '../../context/actions/libraryActions';

import Menu from '../Menu';

const Container = styled.div`
    background-color: rgba(75,85,99,1);
    color: #fff;
    box-shadow: 0 5px 15px 15px rgba(75,85,99, 0.4);
    margin-bottom: 15px;
`;

const InnerContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;

    max-width: 80rem;
    margin-left: auto;
    margin-right: auto;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    padding-top: .75rem;
    padding-bottom: .75rem;
`;

const FilterText = styled.span`
    padding-left: 1.5rem;
    padding-right: .5rem;
`;
const FilterItem = styled.div`
    display: flex;
    position: relative;
`;
const FilterButton = styled.button`
    fill: #ffffff;
    overflow: hidden;

    transform: rotate(0deg);
    transition: all 0.2s ease-out;
    transform: ${(props) => (props.rotate ? 'rotate(-180deg)' : '')};

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
        <Container>
            <InnerContainer>
                <FilterItem>
                    <FilterText>Display: {displayType}</FilterText>
                    <FilterButton rotate={displayMenuIsOpen} onClick={() => setDisplayMenuIsOpen(!displayMenuIsOpen)} id="display-menu" aria-haspopup="true"><ChevronDownArrow /></FilterButton>
                    <Menu isOpen={displayMenuIsOpen} labelledby={'display-menu'} children={displayMenuItems} vOffset={'2rem'}/>
                </FilterItem>
                <FilterItem>
                    <FilterText>Order by: {sortType}</FilterText>
                    <FilterButton rotate={sortMenuIsOpen} onClick={() => setSortMenuIsOpen(!sortMenuIsOpen)} id="sort-order-menu" aria-haspopup="true"><ChevronDownArrow /></FilterButton>
                    <Menu isOpen={sortMenuIsOpen} labelledby={'sort-order-menu'} children={sortMenuItems} vOffset={'2rem'} />
                </FilterItem>
            </InnerContainer>
        </Container>
    ); 
}

export default FilterMenu;
