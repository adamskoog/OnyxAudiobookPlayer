import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import { Transition } from '@headlessui/react'

const Menu = ({ trackInfo, baseUrl, authToken, playSelectedTrack, markPlayed, markUnplayed, updateAlbumInfo, setIsOpen, isOpen }) => {

    return (
        <div className="flex items-center">
            <div className="ml-3 relative">
                <div>
                    <button onClick={() => setIsOpen(!isOpen)} className="text-lg items-center focus:outline-none" id="user-menu" aria-haspopup="true">
                        <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-three-dots-vertical" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                        </svg>
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
                        <div ref={ref} className="z-50 origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5" role="menu" aria-orientation="vertical" aria-labelledby="user-menu">
                            <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer" role="menuitem" onClick={() => playSelectedTrack(trackInfo)}>Play</div>
                            <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer" role="menuitem" onClick={() => markPlayed(trackInfo, baseUrl, authToken, updateAlbumInfo)}>Mark as Played</div>
                            <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer" role="menuitem" onClick={() => markUnplayed(trackInfo, baseUrl, authToken, updateAlbumInfo)}>Mark as Unplayed</div>
                        </div>
                    )}
                </Transition>
            </div>
        </div>
    ); 
}

export default Menu;