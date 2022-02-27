import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import { Transition } from '@headlessui/react'
import { Link, useLocation } from 'react-router-dom';

import { ReactComponent as HamburgerSvg } from '../assets/menuHamburger.svg';

const NavContainer = styled.nav`
    background-color: rgba(31, 41, 55, 1);
`;
const Container = styled.div`
    max-width: 80rem;
    margin-left: auto;
    margin-right: auto;
    padding-left: 1rem;
    padding-right: 1rem;

    @media (min-width: 640px) {
        padding-left: 1.5rem;
        padding-right: 1.5rem;
    }
    @media (min-width: 1024px) {
        padding-left: 2rem;
        padding-right: 2rem;       
    }
`;
const NavContent = styled.div`
    position: relative;
    height: 4rem;
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

    @media (min-width: 768px) {
        display: none;
    }
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

    @media (min-width: 640px) {
        display: none;
    }
`;
const MobileButton = styled.button`
    display: inline-flex;
    justify-content: center;
    align-items: center;

    border-radius: 0.375rem;
    padding: 0.5rem;

    color: rgba(156, 163, 175, 1);

    &:hover {
        color: #fff;
        background-color: rgba(55, 65, 81, 1);
    }
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

const TitleContainer = styled.div`
    display: flex;
    flex: 1 1;
    justify-content: center;
    align-items: center;

    @media (min-width: 640px) {
        justify-content: flex-start;
        align-items: stretch;
    }
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

    @media (min-width: 640px) {
        display: block;
    }
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

const Header = (props) => {

    const TITLE = "Onyx Player";
    const [accountIsOpen, setAccountIsOpen] = useState(false);
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
            return "block md:hidden z-50";
        }
        return "hidden md:hidden";
    }

    const closeAccountMenu = () => {
        if (accountIsOpen) setAccountIsOpen(false);
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
        if (!accountIsOpen) return;
        document.addEventListener("click", closeAccountMenu);
        return () => { document.removeEventListener("click", closeAccountMenu); }
    }, [accountIsOpen]);

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
                        <button className="nav-menu nav-signin text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium" onClick={() => props.doUserLogin()}>Login</button>
                    )}
                      <div className="ml-4 flex items-center md:ml-6">
                          <div className="ml-3 relative">
                              <div>
                                  <button onClick={() => setAccountIsOpen(!accountIsOpen)} className="max-w-xs bg-gray-800 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white" id="user-menu" aria-haspopup="true">
                                  <span className="sr-only">Open user menu</span>
                                      {props.userInfo && (
                                      <img className="h-12 w-12 rounded-full" src={props.userInfo.thumb} alt="" />
                                      )}
                                  </button>
                              </div>

                              <Transition
                                show={accountIsOpen}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95">
                                {(ref) => (
                                  <div ref={ref} className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 z-50 bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-300" role="menu" aria-orientation="vertical" aria-labelledby="user-menu">
                                      <div className="py-1">
                                        <Link className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem" to={`/settings`}>Settings</Link>
                                      </div>
                                      <div className="py-1">
                                        <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer" role="menuitem" onClick={props.doUserLogout}>Sign Out</div>
                                      </div>
                                  </div>
                                )}
                              </Transition>
                          </div>
                      </div>
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