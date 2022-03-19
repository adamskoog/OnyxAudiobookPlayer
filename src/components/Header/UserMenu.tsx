import React, { useState, useEffect, ReactElement } from 'react';
import styled from 'styled-components';

import Menu from '../Menu';
import { SrOnly } from '../util/common';

const Container = styled.div`
    position: relative;
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

type Props = {
    userInfo: any,
    doUserLogout: any
}

function SettingsMenu({ userInfo, doUserLogout }: Props): ReactElement {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems: Array<any> = [
    { title: 'Settings', linkTo: '/settings' },
    { title: 'Sign Out', callback: doUserLogout },
  ];

  useEffect(() => {
    if (!isOpen) return;

    const closeMenu = (): void => {
      if (isOpen) setIsOpen(false);
    };

    document.addEventListener('click', closeMenu);
    return () => { document.removeEventListener('click', closeMenu); };
  }, [isOpen]);

  return (
    <Container>
      <AvatarButton onClick={() => setIsOpen(!isOpen)} id="user-menu" aria-haspopup="true">
        <SrOnly>Open user menu</SrOnly>
        {userInfo && (
        <Avatar src={userInfo.thumb} alt="avatar" />
        )}
      </AvatarButton>
      <Menu isOpen={isOpen} labelledby="user-menu">
        {menuItems}
      </Menu>
    </Container>
  );
}

export default SettingsMenu;
