import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { Transition } from '@headlessui/react'
import TimeUtils from '../../utility/time';
import PlexPlayback from '../../plex/Playback';

// trackInfo.viewOffset = the location in the track
//      this seems to not be complete in most cases, not the full track length.
//      need to determine how to handle this
// trackInfo.viewCount = the play count of the file
// trackInfo.duration = the length of the track, seconds?

const mapStateToProps = state => {
    return { 
        authToken: state.application.authToken,
        baseUrl: state.application.baseUrl,
        currentTrack: state.playQueue.currentTrack
    };
};

function ConnectedAlbumItem(props) {

    const trackClass = () => {
        var output = ["album-track"];
        if (props.trackInfo.viewOffset) {
            if (PlexPlayback.trackIsComplete(props.trackInfo.viewOffset, props.trackInfo.duration)) {
                output.push("complete");
            } else {
                output.push("in-progress");
            }
        }
        return output.join(" ");
    }

    const markPlayed = (trackInfo) => {
        PlexPlayback.markTrackPlayed(trackInfo , props.baseUrl, props.authToken)
            .then(() => {
                props.updateAlbumInfo();
            });
    }
 
    const markUnplayed = (trackInfo) => {
        PlexPlayback.markTrackUnplayed(trackInfo , props.baseUrl, props.authToken)
            .then(() => {
                props.updateAlbumInfo();
            });
    }

    const [isOpen, setIsOpen] = useState(false);

    const closeMenu = () => {
        if (isOpen) setIsOpen(false);
    }

    useEffect(() => {
        document.addEventListener("click", closeMenu);
        return () => { document.removeEventListener("click", closeMenu); }
    }, [isOpen]);

    useEffect(() => {
        if (props.currentTrack && props.trackInfo) {
            if (props.currentTrack.key === props.trackInfo.key) {
                props.updateAlbumInfo();
            }
        }
    }, [props.currentTrack]);

    return (
        <tr className={trackClass()}>
            <td className="col-track-play">
                <button className="btn btn-track-play" type="button" onClick={() => props.playSelectedTrack(props.trackInfo)}>
                    <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-x-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                        <path fillRule="evenodd" d="m 12.654334,8.697 -6.3630006,3.692 c -0.54,0.313 -1.233,-0.066 -1.233,-0.697 V 4.308 c 0,-0.63 0.692,-1.01 1.233,-0.696 l 6.3630006,3.692 a 0.802,0.802 0 0 1 0,1.393 z"/>
                    </svg>
                </button>
            </td>
            <td className="col-track-index">
                <div className="album-track-index">{props.trackInfo.index}</div>
            </td>
            <td className="col-track-title">{props.trackInfo.title}</td>
            <td className="col-track-duration">{TimeUtils.formatTrackDisplay(props.trackInfo.duration)}</td>
            <td className="col-track-options">
                <div className="ml-4 flex items-center md:ml-6">
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
                                    <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer" role="menuitem" onClick={() => markPlayed(props.trackInfo)}>Mark as Played</div>
                                    <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer" role="menuitem" onClick={() => markUnplayed(props.trackInfo)}>Mark as Unplayed</div>
                                </div>
                            )}
                        </Transition>
                    </div>
                </div>
            </td>
        </tr>
    ); 
}

const AlbumItem = connect(mapStateToProps)(ConnectedAlbumItem);

export default AlbumItem;
