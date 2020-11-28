import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container, Row } from 'react-bootstrap';
import AlbumItem from './AlbumListItem';
import PlexRequest from '../plex/PlexRequest';
import { Redirect } from 'react-router-dom';

//https://reactgo.com/javascript-get-data-from-api/
class Library extends Component {
    state = {
        baseUrl: this.props.baseUrl,
        userInfo: this.props.userInfo,
        section: this.props.section,
        items: []
    }
  
    componentDidMount() {
        if (this.state.userInfo && this.state.baseUrl && this.state.section) {
            PlexRequest.getLibraryItems(this.state.baseUrl, this.state.section, { "X-Plex-Token": this.state.userInfo.authToken })
                .then(data => {
                    if (data.MediaContainer.Metadata)
                        this.setState({ items: data.MediaContainer.Metadata });
                });
        }
    }

    render() {
        return (
            <React.Fragment>
            {!this.state.userInfo && (
                <Redirect to="/" />
            )}
            {(!this.state.baseUrl || !this.state.section) && (
                <div>Failed to load library, please update your settings.</div>
            )}
            {this.state.userInfo && this.state.baseUrl && this.state.section && (
            <Container className="p-3">
                <Row>
                    {this.state.items.map((item) => (
                        <AlbumItem key={item.key} baseUrl={this.state.baseUrl} userInfo={this.state.userInfo} albumInfo={item} />
                    ))}
                </Row>
            </Container>
            )}
            </React.Fragment>
        ); 
    }
}

Library.propTypes = {
    baseUrl: PropTypes.string,
    userInfo: PropTypes.object,
    section: PropTypes.string
}

export default Library;
