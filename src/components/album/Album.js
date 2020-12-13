import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import AlbumItem from './AlbumItem';
import PlexRequest from '../../plex/PlexRequest';
import AlbumHelpers from '../../plex/AlbumHelpers';

import * as playQueueActions from "../../context/actions/playQueueActions";

const mapStateToProps = state => {
    return { 
        authToken: state.application.authToken,
        baseUrl: state.application.baseUrl,
        librarySection: state.settings.librarySection,
    };
};

 const mapDispatchToProps = dispatch => {
    return {
        setPlayQueue: (queue) => dispatch(playQueueActions.setPlayQueue(queue)),
    };
};

function ConnectedAlbum(props) {

    const [album, setAlbum] = useState({ Metadata: [] });
    const [onDeck, setOnDeck] = useState(null);

    function expandContainerClass() {
        if (album && album.summary) {
            var splitted = album.summary.split("\n");
            if (splitted.length <= 1)
                return "no-expand";
        }
        return "expand";
    }

    const expandSummary = () => {
        let container = document.querySelector(".album-summary-container");
        let btnExpand = document.querySelector(".btn.btn-expand-summary");

        if (container && btnExpand) {
            if (container.classList.contains('expand')) {
                container.classList.remove('expand');
                btnExpand.innerHTML = "Expand";
            } else {
                container.classList.add('expand');
                btnExpand.innerHTML = "Collapse";
            }
        }
    }

    const formatSummary = (summary) => {
        if (summary) {
            var splitted = summary.split("\n");
            return `<p>${splitted.join("</p><p>")}</p>`;
        }
        return "";
    }

    const playOnDeckTrack = (trackInfo) => {

        let playQueue = AlbumHelpers.getAlbumQueue(trackInfo, album);
        props.setPlayQueue(playQueue);
    }

    const playSelectedTrack = (trackInfo) => {
        // TODO: Check for played track, if it is current on deck (tbd)
        // then we need to tell user they are changing played track
        // progress
            
        // TODO: If they are playing a track out of order, we need to update all
        // tracks to make sure previous are played and remaining are unplayed.
        // This will likely require timeline updates to be sent for all tracks <-- TODO: is this a bad idea???
        let playQueue = AlbumHelpers.getAlbumQueue(trackInfo, album);
        props.setPlayQueue(playQueue);
    }

    const getAlbumMetadata = () => {
        PlexRequest.getAlbumMetadata(props.baseUrl, props.ratingKey, { "X-Plex-Token": props.authToken })
            .then(data => {
                if (data.MediaContainer) {
                    let onDeck = AlbumHelpers.findOnDeck(data.MediaContainer);
                    setAlbum(data.MediaContainer);
                    setOnDeck(onDeck);
                }
            });
    }

    useEffect(() => {
        if (props.authToken && props.baseUrl && props.ratingKey)
            getAlbumMetadata();
    }, [props.baseUrl, props.authToken, props.ratingKey]);

    return (
        <React.Fragment>
        {props.authToken && (
        <div className="album-info-container">
            <img className="album-cover mr-4" src={PlexRequest.getThumbnailTranscodeUrl(200, 200, props.baseUrl, album.thumb, props.authToken)} alt="Album Cover" />
            <div className="album-info">
                <div className="mt-1 album-title">{album.parentTitle}</div>
                <div className="mt-1 album-artist">{album.grandparentTitle}</div>
                <div className="album-year">{album.parentYear}</div>
                {onDeck && (
                <div className="on-deck">
                    <button className="btn btn-play-on-deck" type="button" onClick={() => playOnDeckTrack(onDeck)}>
                        <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-x-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                            <path fillRule="evenodd" d="m 12.654334,8.697 -6.3630006,3.692 c -0.54,0.313 -1.233,-0.066 -1.233,-0.697 V 4.308 c 0,-0.63 0.692,-1.01 1.233,-0.696 l 6.3630006,3.692 a 0.802,0.802 0 0 1 0,1.393 z"/>
                        </svg>
                    </button>
                    <div className="on-deck-title">{onDeck.title}</div>
                </div>
                )}
            </div>
            <div className={expandContainerClass()}>
                <div className="mt-3 album-summary-container">
                    <div className="album-summary" dangerouslySetInnerHTML={{__html: formatSummary(album.summary)}}></div>
                </div>
                <div className="expand-btn-container">
                    <div className="separator"></div>
                    <button className="btn btn-dark btn-expand-summary" type="button" onClick={() => expandSummary()}>Expand</button>
                </div>
            </div>
            <div className="track-container">
                <div className="mb-2 track-header">{album.size} Track{(album.size > 1) ? "s" : ""}</div>
                <table>
                    <tbody>
                        {album.Metadata.map((track) => (
                            <AlbumItem key={track.key} trackInfo={track} baseUrl={props.baseUrl} userInfo={props.user} playSelectedTrack={playSelectedTrack} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
        )}
        </React.Fragment>
    ); 
}

const Album = connect(mapStateToProps, mapDispatchToProps)(ConnectedAlbum);

export default Album;