import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import * as Responsive from '../util/responsive';
import { Link, useLocation } from 'react-router-dom';

import UserMenu from './UserMenu';
import { SrOnly } from '../util/common';

import { ReactComponent as HamburgerSvg } from '../../assets/menuHamburger.svg';

const HEADER_HEIGHT = '64px';

const NavContainer = styled.nav`
    background-color: rgba(31, 41, 55, 1);
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
    ${Responsive.largeMediaQuery(`
        padding-left: 2rem;
        padding-right: 2rem; 
    `)}
`;
const NavContent = styled.div`
    position: relative;
    height: ${HEADER_HEIGHT};
    display: flex;
    justify-content: space-between;
    align-items: center;
`;


const MobileMenuContainer = styled.div`
    display: ${(props) => (props.isOpen) ? 'block' : 'none' };
    z-index: 50;

    padding-top: 0.5rem;
    padding-left: 0.75rem;
    padding-right: 0.75rem;
    padding-bottom: 0.5rem;

    ${Responsive.mediumMediaQuery(`
        display: none;
    `)}
`;

const MobileMenuItem = styled(Link)`
    display: block;
    border-radius: 0.375rem;

    color: rgba(209, 213, 219, 1);
    font-size: 1rem;
    line-height: 1.5rem;
    font-weight: 500;

    margin-top: 0.25rem;

    padding-top: 0.5rem;
    padding-left: 0.75rem;
    padding-right: 0.75rem;
    padding-bottom: 0.5rem;

    &:hover {
        color: #fff;
        background-color: rgba(55, 65, 81, 1);
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

    color: rgba(156, 163, 175, 1);

    &:hover {
        color: #fff;
        background-color: rgba(55, 65, 81, 1);
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

    color: #fff;

`;
const TitleMenuItem = styled.div`
    display: none;
    margin-left: 2.5rem;

    ${Responsive.smallMediaQuery(`
        display: block;
    `)}
`;

const TitleMenuItemLink = styled(Link)`
    color: rgba(209, 213, 219, 1);

    padding-top: 0.5rem;
    padding-left: 0.75rem;
    padding-right: 0.75rem;
    padding-bottom: 0.5rem;

    border-radius: 0.375rem;

    font-size: 0.875rem;
    line-height: 1.25rem;
    font-weight: 500;

    &.active {
        color: #fff;
        background-color: rgba(75, 85, 99, 1);
    }
    &:hover {
        color: #fff;
        background-color: rgba(55, 65, 81, 1);
    }
`;

const TitleMenuItemButton = styled.button`
    color: rgba(209, 213, 219, 1);

    padding-top: 0.5rem;
    padding-left: 0.75rem;
    padding-right: 0.75rem;
    padding-bottom: 0.5rem;

    border-radius: 0.375rem;

    font-size: 0.875rem;
    line-height: 1.25rem;
    font-weight: 500;

    &.active {
        color: #fff;
        background-color: rgba(75, 85, 99, 1);
    }
    &:hover {
        color: #fff;
        background-color: rgba(55, 65, 81, 1);
    }
`;

const Header = (props) => {

    const TITLE = "Onyx Player";
    const [menuIsOpen, setMenuIsOpen] = useState(false);

    const location = useLocation();

    const navButtonCss = (active) => {
        let elems = document.querySelectorAll(".nav-menu");
        elems.forEach((elem) => {
            if (elem.classList.contains(active)) {
                elem.classList.add("active");
            } else {
                elem.classList.remove("active");
            }
        });
    }

    const menuCss = (isOpen) => {
        const main = props.containerRef.current;
        if (main) {
            main.classList.remove("menu-open");
        }
        if (main && isOpen) {
            main.classList.add("menu-open");
        }
        return;
    }

    const closeMainMenu = () => {
        if (menuIsOpen) setMenuIsOpen(false);
    }

    useEffect(() => {
        if (!location) return;
        
        switch (location.pathname) {
            case "/library":
                navButtonCss("nav-library");
                break;
            case "/":
                navButtonCss("nav-home");
                break;
            default:
                navButtonCss("nav-empty");
        }
    }, [location]);

    useEffect(() => {
        menuCss(menuIsOpen);

        if (!menuIsOpen) return;
        document.addEventListener("click", closeMainMenu);
        return () => { document.removeEventListener("click", closeMainMenu); }
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
                            <TitleMenuItemLink className="nav-menu nav-home" to={`/`}>Home</TitleMenuItemLink>
                        </TitleMenuItem>
                        <TitleMenuItem>
                            <TitleMenuItemLink className="nav-menu nav-library" to={`/library`}>Library</TitleMenuItemLink>
                        </TitleMenuItem>
                    </TitleContainer>

                    {!props.userInfo && (
                        <TitleMenuItemButton className="nav-menu nav-signin" onClick={() => props.doUserLogin()}>Login</TitleMenuItemButton>
                    )}

                    <UserMenu userInfo={props.userInfo} doUserLogout={props.doUserLogout} />
                </NavContent>
            </Container>

            <MobileMenuContainer isOpen={menuIsOpen}>
                <MobileMenuItem to={`/`}>Home</MobileMenuItem>
                <MobileMenuItem to={`/library`}>Library</MobileMenuItem>
            </MobileMenuContainer>
        </NavContainer>
    ); 
}

export default Header;