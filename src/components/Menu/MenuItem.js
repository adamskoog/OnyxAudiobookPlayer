import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import * as Colors from '../util/colors';

const sharedCss = `
    color: ${Colors.LIGHT_CONTEXT_MENU_TEXT};
    padding: .5rem 1rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
    cursor: pointer;

    &:hover {
        color: ${Colors.LIGHT_CONTEXT_MENU_TEXT_HOVER};
        background-color: ${Colors.LIGHT_CONTEXT_MENU_BG_HOVER};
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