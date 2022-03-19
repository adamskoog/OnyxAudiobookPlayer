import React from 'react';
import styled from 'styled-components';
import { Transition } from '@headlessui/react';

import MenuItem from './MenuItem';

const MenuContainer: any = styled.div`
    transform-origin: top right;
    z-index: 50;
    width: 12rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    position: absolute;
    right: 0px;
    padding-top: 0.25rem;
    padding-bottom: 0.25rem;
    margin-top: ${(props: any) => (props.vOffset ? props.vOffset : '0.5rem')};
    border-radius: 0.375rem;
    background-color: ${({ theme }) => theme.CONTEXT_MENU_BG};

    & > * + * {
        border-top-width: 1px;
        border-bottom-width: 0px;
        border-color: ${({ theme }) => theme.CONTEXT_MENU_BORDER};
    }
`;

type Props = {
    labelledby: string,
    isOpen: boolean
    children?: any,
    vOffset?: string
}

const Menu = ({ labelledby, children, isOpen, vOffset }: Props) => {
    
    return (
        <Transition
            show={isOpen}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95">
        {(
            <MenuContainer role="menu" aria-orientation="vertical" aria-labelledby={labelledby} vOffset={vOffset}>
                {(children.map((child) => (
                    <MenuItem key={child.title} {...child} />
                )))}
            </MenuContainer>
        )}
    </Transition>
    );
};

export default Menu;