import React, { ReactElement } from 'react';
import Link from 'next/link';
import styled from 'styled-components';

const sharedCss = (theme: any): string => `
        color: ${theme.CONTEXT_MENU_TEXT};
        padding: .5rem 1rem;
        font-size: 0.875rem;
        line-height: 1.25rem;
        cursor: pointer;

        &:hover {
            color: ${theme.CONTEXT_MENU_TEXT_HOVER};
            background-color: ${theme.CONTEXT_MENU_BG_HOVER};
        }`;
const MenuItemButton = styled.button`
    width: 100%;
    text-align: left;
    ${({ theme }) => sharedCss(theme)}
`;
const MenuItemLink = styled.div`
    width: 100%;
    text-align: left;
    ${({ theme }) => sharedCss(theme)}
`;

type Props = {
    title: string,
    linkTo: string
    callback?: any
}

function MenuItem({ linkTo, callback, title }: Props): ReactElement {
  if (callback) {
    return (<MenuItemButton role="menuitem" onClick={callback}>{title}</MenuItemButton>);
  }
  return (<Link href={linkTo}><MenuItemLink>{title}</MenuItemLink></Link>);
}

MenuItem.defaultProps = {
  callback: null,
};

export default MenuItem;
