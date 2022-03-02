import React from 'react';
import styled from 'styled-components';

import { Link } from 'react-router-dom';

const sharedCss = `
    color: rgba(55, 65, 81, 1);
    padding: .5rem 1rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
    cursor: pointer;

    &:hover {
        background-color: rgba(243, 244, 246, 1);
    }
`;
const MenuItemButton = styled.button`
    width: 100%;
    text-align: left;
    ${sharedCss}
`;
const MenuItemLink = styled(Link) `
    display: block;
    ${sharedCss}
`;

const MenuItem = ({ linkTo, callback, title}) => {
    
    if (callback) {
        return (<MenuItemButton role="menuitem" onClick={callback}>{title}</MenuItemButton>);
    } else {
        return (<MenuItemLink role="menuitem" to={linkTo}>{title}</MenuItemLink>);
    }
};

export default MenuItem;