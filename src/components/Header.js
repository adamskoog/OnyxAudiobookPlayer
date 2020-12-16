import React, { useState, useEffect } from 'react';
import { Transition } from '@headlessui/react'
import { Link, useLocation } from 'react-router-dom';

function Header(props) {

    const [accountIsOpen, setAccountIsOpen] = useState(false);
    const [menuIsOpen, setMenuIsOpen] = useState(false);

    const location = useLocation();

    const navButtonCss = (active) => {
        let elems = document.querySelectorAll(".nav-menu");
        elems.forEach((elem) => {
            if (elem.classList.contains(active)) {
                elem.classList.remove("text-gray-300");
                elem.classList.add("text-white");
                elem.classList.add("bg-gray-600");
            } else {
                elem.classList.remove("text-white");
                elem.classList.remove("bg-gray-600");
                elem.classList.add("text-gray-300");
            }
        });
    }

    const menuCss = (isOpen) => {
        if (isOpen)
            return "block md:hidden z-50";
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
        if (!menuIsOpen) return;
        document.addEventListener("click", closeMainMenu);
        return () => { document.removeEventListener("click", closeMainMenu); }
    }, [menuIsOpen]);

    return (
      <nav className="bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="relative flex items-center justify-between h-16">

                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                    <button  onClick={() => setMenuIsOpen(!menuIsOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" aria-expanded="false">
                        <span className="sr-only">Open main menu</span>
                        <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                        <svg className="hidden h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                  <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                      <div className="flex-shrink-0 flex items-center">
                          <div className="text-white block md:hidden h-8 w-auto">Onyx Player</div>
                          <div className="text-white hidden md:block h-8 w-auto">Onyx Player</div>
                      </div>
                      <div className="hidden sm:block">
                          <div className="ml-10 flex items-baseline space-x-4">
                              <Link className="nav-menu nav-home text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium" to={`/`}>Home</Link>
                          </div>
                      </div>
                      <div className="hidden sm:block">
                          <div className="ml-10 flex items-baseline space-x-4">
                              <Link className="nav-menu nav-library text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium" to={`/`}>Library</Link>
                          </div>
                      </div>
                  </div>
                  <div>
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
                  </div>
              </div>
          </div>
          {/* TODO: This is not going to work correctly, until something is done for autoresize of main content pane. */}
          <div className={menuCss(menuIsOpen)}>
                <div className="px-2 pt-2 pb-3 space-y-1">
                    <Link className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium" to={`/`}>Home</Link>
                    <Link className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium" to={`/`}>Library</Link>
                </div>
            </div>
      </nav>
    ); 
}

export default Header;