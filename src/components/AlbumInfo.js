import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AlbumTrack from './AlbumTrack';
import PlexRequest from '../plex/PlexRequest';
import AlbumHelpers from '../plex/AlbumHelpers';
import { Redirect } from 'react-router-dom';

class AlbumInfo extends Component {

    state = {
        baseUrl: this.props.baseUrl,
        userInfo: this.props.userInfo,
        ratingKey: this.props.ratingKey,
        album: { Metadata: [] },
        onDeck: null
    }

    expandSummary = () => {
        if (this.summary.classList.contains('expand')) {
            this.summary.classList.remove('expand');
            this.expandBtn.innerHTML = "Expand";
        } else {
            this.summary.classList.add('expand');
            this.expandBtn.innerHTML = "Collapse";
        }
    }

    formatSummary = (summary) => {
        if (summary) {
            var splitted = summary.split("\n");
            return `<p>${splitted.join("</p><pd>")}</p>`;
        }
        return "";
    }

    playOnDeckTrack = (trackInfo) => {

        let playQueue = AlbumHelpers.getAlbumQueue(trackInfo, this.state.album);
        this.props.playQueue(playQueue);
    }

    playSelectedTrack = (trackInfo) => {
            // Check for played track, if it is current on deck (tbd)
        // then we need to tell user they are changing played track
        // progress

        // TODO: testing of marking track played.
            //console.log("marking track played", trackInfo);
            //AlbumHelpers.markTrackPlayed(trackInfo , this.state.baseUrl, this.state.userInfo.authToken);
            
        // If they are playing a track out of order, we need to update all
        // tracks to make sure previous are played and remaining are unplayed.
        // This will likely require timeline updates to be sent for all tracks <-- TODO: is this a bad idea???
        let playQueue = AlbumHelpers.getAlbumQueue(trackInfo, this.state.album);
        this.props.playQueue(playQueue);
    }

    componentDidMount ()  {
        if (this.state.userInfo) {
            PlexRequest.getAlbumMetadata(this.state.baseUrl, this.state.ratingKey, { "X-Plex-Token": this.state.userInfo.authToken })
                .then(data => {
                    if (data.MediaContainer) {
                        let onDeck = AlbumHelpers.findOnDeck(data.MediaContainer);
                        this.setState({ album: data.MediaContainer, onDeck: onDeck });
                    }
                });
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.album && this.state.album.summary) {
            var splitted = this.state.album.summary.split("\n");
            if (splitted.length <= 1)
                this.expandContainer.classList.add('no-expand');
            else
                this.expandContainer.classList.remove('no-expand');
        } else
            this.expandContainer.classList.remove('no-expand');
    }

    render() {
        return (
            <React.Fragment>
            {!this.props.userInfo && (<Redirect to="/" />)}
            {this.props.userInfo && (
            <div className="album-info-container">
                <img className="album-cover mr-4" src={PlexRequest.getThumbnailUrl(this.state.baseUrl, this.state.album.thumb, { "X-Plex-Token": this.state.userInfo.authToken })} alt="Album Cover" />
                <div className="album-info">
                    <div className="mt-1 album-title">{this.state.album.parentTitle}</div>
                    <div className="mt-1 album-artist">{this.state.album.grandparentTitle}</div>
                    <div className="album-year">{this.state.album.parentYear}</div>
                    {this.state.onDeck && (
                    <div className="on-deck">
                        <button className="btn btn-play-on-deck" type="button" onClick={() => this.playOnDeckTrack(this.state.onDeck)}>
                            <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-x-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                <path fillRule="evenodd" d="m 12.654334,8.697 -6.3630006,3.692 c -0.54,0.313 -1.233,-0.066 -1.233,-0.697 V 4.308 c 0,-0.63 0.692,-1.01 1.233,-0.696 l 6.3630006,3.692 a 0.802,0.802 0 0 1 0,1.393 z"/>
                            </svg>
                        </button>
                        <div className="on-deck-title">{this.state.onDeck.title}</div>
                    </div>
                    )}
                </div>
                <div className="no-expand" ref={el => this.expandContainer = el}>
                    <div className="mt-3 album-summary-container" ref={ref => this.summary = ref}>
                        <div className="album-summary" dangerouslySetInnerHTML={{__html: this.formatSummary(this.state.album.summary)}}></div>
                    </div>
                    <div className="expand-btn-container">
                        <div className="separator"></div>
                        <button className="btn btn-dark" type="button" ref={ref => this.expandBtn = ref} onClick={() => this.expandSummary()}>Expand</button>
                    </div>
                </div>
                <div className="track-container">
                    <div className="mb-2 track-header">{this.state.album.size} Track{(this.state.album.size > 1) ? "s" : ""}</div>
                    <table>
                        <tbody>
                            {this.state.album.Metadata.map((track) => (
                                <AlbumTrack key={track.key} trackInfo={track} baseUrl={this.state.baseUrl} userInfo={this.state.userInfo} playSelectedTrack={this.playSelectedTrack} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            )}
            </React.Fragment>
        ); 
    }
}

AlbumInfo.propTypes = {
    baseUrl: PropTypes.string.isRequired,
    userInfo: PropTypes.object.isRequired,
    ratingKey: PropTypes.string.isRequired,
    playQueue: PropTypes.func.isRequired
}

export default AlbumInfo;
