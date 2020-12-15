import React, { useState, useEffect } from 'react';
import { Transition } from '@headlessui/react'
import { Link } from 'react-router-dom';

function Header(props) {

    const [isOpen, setIsOpen] = useState(false);

    const closeMenu = () => {
        if (isOpen) setIsOpen(false);
    }

    useEffect(() => {
        document.addEventListener("click", closeMenu);
        return () => { document.removeEventListener("click", closeMenu); }
    }, [isOpen]);

    return (
      <nav className="bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                  <div className="flex items-center">
                      <div className="flex-shrink-0">
                          <div className="text-white px-3 py-2 text-xl font-medium">Onyx Player</div>
                          {/* <img className="h-8 w-8" src="https://tailwindui.com/img/logos/workflow-mark-indigo-500.svg" alt="Workflow" /> */}
                      </div>
                      <div> {/* className="hidden md:block" */}
                          <div className="ml-10 flex items-baseline space-x-4">
                              <Link className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium" to={`/`}>Home</Link>
                          </div>
                      </div>
                  </div>
                  <div> {/* className="hidden md:block" */}
                      <div className="ml-4 flex items-center md:ml-6">
                          <div className="ml-3 relative">
                              <div>
                                  <button onClick={() => setIsOpen(!isOpen)} className="max-w-xs bg-gray-800 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white" id="user-menu" aria-haspopup="true">
                                  <span className="sr-only">Open user menu</span>
                                      {props.userInfo && (
                                      <img className="h-12 w-12 rounded-full" src={props.userInfo.thumb} alt="" />
                                      )}
                                  </button>
                              </div>

                              <Transition
                                show={isOpen}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95">
                                {(ref) => (
                                  <div ref={ref} className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5" role="menu" aria-orientation="vertical" aria-labelledby="user-menu">
                                      <Link className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem" to={`/settings`}>Settings</Link>
                                      {/* <div className="item-separator"></div> */}
                                      <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer" role="menuitem" onClick={props.doUserLogout}>Sign Out</div>
                                  </div>
                                )}
                              </Transition>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </nav>
    ); 
}

export default Header;