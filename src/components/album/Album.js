import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import AlbumItem from './AlbumItem';
import PlexApi from '../../plex/Api';
import PlexPlayback from '../../plex/Playback';

import * as playQueueActions from "../../context/actions/playQueueActions";

const mapStateToProps = state => {
    return { 
        authToken: state.application.authToken,
        baseUrl: state.application.baseUrl,
        librarySection: state.settings.librarySection
    };
};

 const mapDispatchToProps = dispatch => {
    return {
        setPlayQueue: (queue) => dispatch(playQueueActions.setPlayQueue(queue)),
    };
};

const TrackContainer = styled.div`
    display: grid;
    grid-template-columns: 30px 30px auto 65px 30px;
    row-gap: .8rem;
    align-items: center;

    border-top: solid 1px black;
    padding-top: .8rem;
`;

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
        let container = document.querySelector(".album-summary");
        let btnExpand = document.querySelector(".btn-expand-summary");

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
        props.setPlayQueue(PlexPlayback.getAlbumQueue(trackInfo, album));
    }

    const playSelectedTrack = (trackInfo) => {
        if (!PlexPlayback.isTrackOnDeck(trackInfo, album)) {
            PlexPlayback.updateOnDeck(trackInfo, album, props.baseUrl, props.authToken)
                .then(() => {
                    getAlbumMetadata()
                        .then((info) => {
                            props.setPlayQueue(PlexPlayback.getAlbumQueue(info.track, info.album));
                        });
                });
        }
        else
            playOnDeckTrack(trackInfo);
    }

    const getAlbumMetadata = () => {
        return new Promise ((resolve) => {
            PlexApi.getAlbumMetadata(props.baseUrl, props.ratingKey, { "X-Plex-Token": props.authToken })
                .then(data => {
                    if (data.MediaContainer) {
                        const onDeck = PlexPlayback.findOnDeck(data.MediaContainer);
                        resolve({ album: data.MediaContainer, track: onDeck });

                        setAlbum(data.MediaContainer);
                        setOnDeck(onDeck);
                    }
                });
        });
    }

    useEffect(() => {
        if (props.authToken && props.baseUrl && props.ratingKey)
            getAlbumMetadata();
    }, [props.baseUrl, props.authToken, props.ratingKey]);

    //https://tailwindcomponents.com/component/button-component-default
    return (
        <React.Fragment>
        {props.authToken && (
        <div className="album-info-container">
            <div className="flex space-x-4">
                <div className="flex-none align-baseline">
                    <img className="album-cover mr-4 shadow-xl rounded-md" src={PlexApi.getThumbnailTranscodeUrl(200, 200, props.baseUrl, album.thumb, props.authToken)} alt="Album Cover" />
                </div>
                <div className="flex-grow align-baseline relative">
                    <div className="mt-1 album-title text-xl">{album.parentTitle}</div>
                    <div className="mt-1 album-artist text-lg">{album.grandparentTitle}</div>
                    <div className="mt-1 album-year text-md">{album.parentYear}</div>
                    {onDeck && (
                    <div className="table absolute bottom-0 mt-8">
                        <div className="table-cell align-middle">
                        <button className="text-3xl pr-3 align-middle" type="button" onClick={() => playOnDeckTrack(onDeck)}>
                            <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-x-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                <path fillRule="evenodd" d="m 12.654334,8.697 -6.3630006,3.692 c -0.54,0.313 -1.233,-0.066 -1.233,-0.697 V 4.308 c 0,-0.63 0.692,-1.01 1.233,-0.696 l 6.3630006,3.692 a 0.802,0.802 0 0 1 0,1.393 z"/>
                            </svg>
                        </button>
                        {onDeck.title}
                        </div>
                    </div>
                    )}
                </div>
            </div>
            <div className={expandContainerClass()}>
                <div className="mt-3 album-summary text-base">
                    <div className="inline-block space-y-1" dangerouslySetInnerHTML={{__html: formatSummary(album.summary)}}></div>
                </div>
                <div className="expand-btn-container">
                    <div className="separator"></div>
                    <button className="border border-gray-700 bg-gray-700 text-white rounded-md px-4 py-2 m-2 transition duration-500 ease select-none hover:bg-gray-800 focus:outline-none focus:shadow-outline btn-expand-summary" type="button" onClick={() => expandSummary()}>Expand</button>
                </div>
            </div>
            <div className="track-container">
                <div className="mb-2 track-header">{album.size} Track{(album.size > 1) ? "s" : ""}</div>
                <TrackContainer>
                    {album.Metadata.map((track) => (
                        <AlbumItem key={track.key} trackInfo={track} playSelectedTrack={playSelectedTrack} updateAlbumInfo={getAlbumMetadata} />
                    ))}
                </TrackContainer>
            </div>
        </div>
        )}
        </React.Fragment>
    ); 
}

const Album = connect(mapStateToProps, mapDispatchToProps)(ConnectedAlbum);

export default Album;