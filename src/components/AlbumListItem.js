import React from 'react';
import { Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PlexRequest from '../plex/PlexRequest';

function AlbumItem(props) {
    return (
        <Col xs={6} sm={6} md={4} xl={3} className="mb-3 album-item">
            <Link to={`/album/${props.albumInfo.ratingKey}`}>
                <img src={PlexRequest.getThumbnailUrl(props.baseUrl, props.albumInfo.thumb, { "X-Plex-Token": props.userInfo.authToken })} alt="Album Cover" loading="lazy" />
                <div className="mt-1">{props.albumInfo.title}</div>
                <div>{props.albumInfo.parentTitle}</div>
            </Link>
        </Col>
    ); 
}

export default AlbumItem;
