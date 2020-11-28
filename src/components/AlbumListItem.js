import { Component } from 'react';
import PropTypes from 'prop-types';
import { Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PlexRequest from '../plex/PlexRequest';

class AlbumItem extends Component {

    render() {
        return (
        <Col xs={6} sm={6} md={4} xl={3} className="mb-3 album-item">
            <Link to={`/album/${this.props.albumInfo.ratingKey}`}>
                <img src={PlexRequest.getThumbnailUrl(this.props.baseUrl, this.props.albumInfo.thumb, { "X-Plex-Token": this.props.userInfo.authToken })} alt="Album Cover"/>
                <div className="mt-1">{this.props.albumInfo.title}</div>
                <div>{this.props.albumInfo.parentTitle}</div>
            </Link>
        </Col>
        ); 
    }
}

AlbumItem.propTypes = {
    baseUrl: PropTypes.string.isRequired,
    userInfo: PropTypes.object.isRequired,
    albumInfo: PropTypes.object.isRequired
}

export default AlbumItem;
