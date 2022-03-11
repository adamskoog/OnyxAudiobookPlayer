import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { ReactComponent as ChevronDownArrow } from '../../assets/chevronDownArrow.svg';

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

const ChevronDownArrowStyled = styled(ChevronDownArrow)`
    fill: #ffffff;
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
`;

const FilterMenu = () => {
    // TODO: these first 2 need to be global state to affect
    // what is being sorted in the library view.
    const [displayOption, setDisplayOption] = useState('Book');
    const [sortOption, setSortOption] = useState('Ascending');

    const [displayMenuIsOpen, setDisplayMenuIsOpen] = useState(false);
    const displayMenuItems = [
        { title: 'Book', callback: () => setDisplayOption('Book') },
        { title: 'Author', callback: () => setDisplayOption('Author') }
    ];

    const [sortMenuIsOpen, setSortMenuIsOpen] = useState(false);
    const sortMenuItems = [
        { title: 'Ascending', callback: () => setSortOption('Ascending') },
        { title: 'Descending', callback: () => setSortOption('Descending') }
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
                    <FilterText>Display: {displayOption}</FilterText>
                    <FilterButton onClick={() => setDisplayMenuIsOpen(!displayMenuIsOpen)} id="display-menu" aria-haspopup="true"><ChevronDownArrowStyled /></FilterButton>
                    <Menu isOpen={displayMenuIsOpen} labelledby={'display-menu'} children={displayMenuItems} vOffset={'2rem'}/>
                </FilterItem>
                <FilterItem>
                    <FilterText>Order by: {sortOption}</FilterText>
                    <FilterButton onClick={() => setSortMenuIsOpen(!sortMenuIsOpen)} id="sort-order-menu" aria-haspopup="true"><ChevronDownArrowStyled /></FilterButton>
                    <Menu isOpen={sortMenuIsOpen} labelledby={'sort-order-menu'} children={sortMenuItems} vOffset={'2rem'} />
                </FilterItem>
            </InnerContainer>
        </Container>
    ); 
}

export default FilterMenu;
