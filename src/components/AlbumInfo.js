import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AlbumTrack from './AlbumTrack';
import PlexRequest from '../plex/PlexRequest';
import { Redirect } from 'react-router-dom';

class AlbumInfo extends Component {

    state = {
        baseUrl: this.props.baseUrl,
        userInfo: this.props.userInfo,
        ratingKey: this.props.ratingKey,
        album: { Metadata: [] }
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

    plexSelectedTrack = (trackInfo) => {
        // Check for played track, if it is current on deck (tbd)
        // then we need to tell user they are changing played track
        // progress

        // If they are playing a track out of order, we need to update all
        // tracks to make sure previous are played and remaining are unplayed.
        // This will likely require timeline updates to be sent for all tracks <-- TODO: is this a bad idea???
        console.log("track played", trackInfo, this.state.album);
        this.props.playTrack(trackInfo);
    }

    componentDidMount ()  {
        if (this.state.userInfo) {
        PlexRequest.getAlbumMetadata(this.state.baseUrl, this.state.ratingKey, { "X-Plex-Token": this.state.userInfo.authToken })
            .then(data => {
                if (data.MediaContainer)
                    this.setState({ album: data.MediaContainer });
            });
        }
    }

    render() {
        //console.log("album", this.state.em);
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
                </div>
                <div className="mt-3 album-summary-container" ref={ref => this.summary = ref}>
                    <div className="album-summary" dangerouslySetInnerHTML={{__html: this.formatSummary(this.state.album.summary)}}></div>
                </div>
                <div className="expand-btn-container">
                    <div className="separator"></div>
                    <button className="btn btn-dark" type="button" ref={ref => this.expandBtn = ref} onClick={() => this.expandSummary()}>Expand</button>
                </div>
                <div className="track-container">
                    <div className="mb-2 track-header">{this.state.album.size} Track{(this.state.album.size > 1) ? "s" : ""}</div>
                    <table>
                        <tbody>
                            {this.state.album.Metadata.map((track) => (
                                <AlbumTrack key={track.key} trackInfo={track} plexSelectedTrack={this.plexSelectedTrack} />
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
    ratingKey: PropTypes.string.isRequired
}

export default AlbumInfo;
