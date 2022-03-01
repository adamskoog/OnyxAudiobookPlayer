import React from 'react';
import styled from 'styled-components';

import { Transition } from '@headlessui/react';
import { Link } from 'react-router-dom';

const Container = styled.div`
    position: relative;
`;

const SrOnly = styled.span`
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
`;

const AvatarButton = styled.button`
    display: flex;
    align-items: center;

    position: relative;
    border-radius: 9999px;

    font-size: 0.875rem;
    line-height: 1.25rem;

`;
const Avatar = styled.img`
    height: 3rem;
    width: 3rem;
    border-radius: 9999px;
`;

const MenuContainer = styled.div`
    transform-origin: top right;
    z-index: 50;
    width: 12rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    position: absolute;
    right: 0px;
    padding-top: 0.25rem;
    padding-bottom: 0.25rem;
    margin-top: 0.5rem;
    border-radius: 0.375rem;
    background-color: rgba(255, 255, 255, 1);

    & > * + * {
        border-top-width: 1px;
        border-bottom-width: 0px;
        border-color: rgba(209, 213, 219, 1);
    }
`;

// TODO: These can be refactored in with TrackMenu.js
const MenuItemButton = styled.button`
    width: 100%;
    text-align: left;
    color: rgba(55, 65, 81, 1);
    padding: .5rem 1rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
    cursor: pointer;

    &:hover {
        background-color: rgba(243, 244, 246, 1);
    }
`;
const MenuItemLink = styled(Link) `
    display: block;
    color: rgba(55, 65, 81, 1);
    padding: .5rem 1rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
    cursor: pointer;

    &:hover {
        background-color: rgba(243, 244, 246, 1);
    }
`;

const SettingsMenu = (props) => {

    return (
        <Container>
            <AvatarButton onClick={() => props.setAccountIsOpen(!props.accountIsOpen)} id="user-menu" aria-haspopup="true">
                <SrOnly>Open user menu</SrOnly>
                {props.userInfo && (
                    <Avatar src={props.userInfo.thumb} alt="avatar" />
                )}
            </AvatarButton>

            <Transition
                show={props.accountIsOpen}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95">
                {(ref) => (
                    <MenuContainer ref={ref} role="menu" aria-orientation="vertical" aria-labelledby="user-menu">
                        <MenuItemLink role="menuitem" to={`/settings`}>Settings</MenuItemLink>
                        <MenuItemButton role="menuitem" onClick={props.doUserLogout}>Sign Out</MenuItemButton>
                    </MenuContainer>
                )}
            </Transition>
        </Container>
    ); 
}

export default SettingsMenu;