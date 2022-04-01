import React, { useState, useEffect, ReactElement } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { useAppSelector, useAppDispatch } from '../../context/hooks';

import * as Responsive from '../util/responsive';

import { logout } from '../../context/actions/appStateActions';
import { prepareLoginRequest } from '../../plex/Authentication';

import UserMenu from './UserMenu';
import { SrOnly } from '../util/common';
import { HEADER_HEIGHT } from '../util/global';

import HamburgerSvg from '-!svg-react-loader!../../assets/menuHamburger.svg';

const NavContainer = styled.nav`
    background-color: ${({ theme }) => theme.NAV_BACKGROUND};
`;
const Container = styled.div`
    max-width: 80rem;
    margin-left: auto;
    margin-right: auto;
    padding-left: 1rem;
    padding-right: 1rem;

    ${Responsive.smallMediaQuery(`
        padding-left: 1.5rem;
        padding-right: 1.5rem;
    `)}
`;
const NavContent = styled.div`
    position: relative;
    height: ${HEADER_HEIGHT};
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const MobileMenuContainer: any = styled.div`
    display: ${(props: any) => ((props.isOpen) ? 'block' : 'none')};
    z-index: 50;

    padding-top: 0.5rem;
    padding-left: 0.75rem;
    padding-right: 0.75rem;
    padding-bottom: 0.5rem;

    ${Responsive.mediumMediaQuery(`
        display: none;
    `)}
`;

const MobileMenuItem = styled.span`
    display: block;
    border-radius: 0.375rem;
    cursor: pointer;
    color: ${({ theme }) => theme.NAV_TEXT};
    font-size: 1rem;
    line-height: 1.5rem;
    font-weight: 500;

    margin-top: 0.25rem;

    padding-top: 0.5rem;
    padding-left: 0.75rem;
    padding-right: 0.75rem;
    padding-bottom: 0.5rem;

    &:hover {
        color: ${({ theme }) => theme.NAV_TEXT_HOVER};
        background-color: ${({ theme }) => theme.NAV_BG_HOVER};
    }
`;
const MobileButtonContainer = styled.div`
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;

    ${Responsive.smallMediaQuery(`
        display: none;
    `)}
`;
const MobileButton = styled.button`
    display: inline-flex;
    justify-content: center;
    align-items: center;

    border-radius: 0.375rem;
    padding: 0.5rem;

    font-size: 1.5rem;
    line-height: 2rem;

    color: ${({ theme }) => theme.NAV_TEXT};

    &:hover {
        color: ${({ theme }) => theme.NAV_TEXT_HOVER};
        background-color: ${({ theme }) => theme.NAV_BG_HOVER};
    }
`;

const TitleContainer = styled.div`
    display: flex;
    flex: 1 1;
    justify-content: center;
    align-items: center;

    ${Responsive.smallMediaQuery(`
        justify-content: flex-start;
        align-items: stretch;
    `)}
`;
const Title = styled.div`
    display: flex;
    flex-shrink: 0;
    align-items: center;

    color: ${({ theme }) => theme.NAV_TITLE_TEXT};

`;
const TitleMenuItem = styled.div`
    display: none;
    margin-left: 2.5rem;

    ${Responsive.smallMediaQuery(`
        display: block;
    `)}
`;

const TitleMenuItemLink = styled.span`
    color: ${({ theme }) => theme.NAV_TEXT};
    cursor: pointer;
    padding-top: 0.5rem;
    padding-left: 0.75rem;
    padding-right: 0.75rem;
    padding-bottom: 0.5rem;

    border-radius: 0.375rem;

    font-size: 0.875rem;
    line-height: 1.25rem;
    font-weight: 500;

    &.active {
        color: ${({ theme }) => theme.NAV_TEXT_ACTIVE};
        background-color: ${({ theme }) => theme.NAV_BG_ACTIVE};
    }
    &:hover {
        color: ${({ theme }) => theme.NAV_TEXT_HOVER};
        background-color: ${({ theme }) => theme.NAV_BG_HOVER};
    }
`;

const TitleMenuItemButton = styled.button`
    color: ${({ theme }) => theme.NAV_TEXT};

    padding-top: 0.5rem;
    padding-left: 0.75rem;
    padding-right: 0.75rem;
    padding-bottom: 0.5rem;

    border-radius: 0.375rem;

    font-size: 0.875rem;
    line-height: 1.25rem;
    font-weight: 500;

    &.active {
        color: ${({ theme }) => theme.NAV_TEXT_ACTIVE};
        background-color: ${({ theme }) => theme.NAV_BG_ACTIVE};
    }
    &:hover {
        color: ${({ theme }) => theme.NAV_TEXT_HOVER};
        background-color: ${({ theme }) => theme.NAV_BG_HOVER};
    }
`;

const doUserLogin = async (): Promise<void> => {
  const response = await prepareLoginRequest();
  window.location.href = response.url;
};

function Header(): ReactElement {
  const dispatch = useAppDispatch();

  const TITLE = 'Onyx Player';
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  const userInfo = useAppSelector((state) => state.application.user);

  const router = useRouter();
  const pathname = router.pathname;

  const navButtonCss = (active: string): void => {
    const elems = document.querySelectorAll('.nav-menu');
    elems.forEach((elem) => {
      if (elem.classList.contains(active)) {
        elem.classList.add('active');
      } else {
        elem.classList.remove('active');
      }
    });
  };

  const closeMainMenu = (): void => {
    if (menuIsOpen) setMenuIsOpen(false);
  };

  useEffect(() => {
    if (!pathname) return;
    switch (pathname) {
      case '/library':
        navButtonCss('nav-library');
        break;
      case '/':
        navButtonCss('nav-home');
        break;
      default:
        navButtonCss('nav-empty');
    }
  }, [pathname]);

  useEffect(() => {
    if (!menuIsOpen) return;
    document.addEventListener('click', closeMainMenu);
    return () => { document.removeEventListener('click', closeMainMenu); };
  }, [menuIsOpen]);

  return (
    <NavContainer>
      <Container>
        <NavContent>
          <MobileButtonContainer>
            <MobileButton onClick={() => setMenuIsOpen(!menuIsOpen)} aria-expanded="false">
              <SrOnly>Open main menu</SrOnly>
              <HamburgerSvg />
            </MobileButton>
          </MobileButtonContainer>

          <TitleContainer>
            <Title>{TITLE}</Title>
            <TitleMenuItem>
              <Link href="/"><TitleMenuItemLink className={'nav-menu nav-home'}>Home</TitleMenuItemLink></Link>
            </TitleMenuItem>
            <TitleMenuItem>
              <Link href="/library"><TitleMenuItemLink className={'nav-menu nav-library'}>Library</TitleMenuItemLink></Link>
            </TitleMenuItem>
          </TitleContainer>

          {!userInfo && (
            <TitleMenuItemButton className="nav-menu nav-signin" onClick={() => doUserLogin()}>Login</TitleMenuItemButton>
          )}

          <UserMenu userInfo={userInfo} doUserLogout={() => dispatch(logout())} />
        </NavContent>
      </Container>

      <MobileMenuContainer isOpen={menuIsOpen}>
        <Link href="/"><MobileMenuItem>Home</MobileMenuItem></Link>
        <Link href="/library"><MobileMenuItem>Library</MobileMenuItem></Link>
      </MobileMenuContainer>
    </NavContainer>
  );
}

export default Header;
