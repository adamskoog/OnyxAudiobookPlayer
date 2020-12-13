import React from 'react';
import { Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PlexApi from '../../plex/Api';

function LibraryItem(props) {
    return (
        <Col xs={6} sm={6} md={4} xl={3} className="mb-3 album-item">
            <Link to={`/album/${props.albumInfo.ratingKey}`}>
                <img src={PlexApi.getThumbnailTranscodeUrl(200, 200, props.baseUrl, props.albumInfo.thumb,  props.userInfo.authToken)} alt="Album Cover" loading="lazy" />
                <div className="mt-1">{props.albumInfo.title}</div>
                <div>{props.albumInfo.parentTitle}</div>
            </Link>
        </Col>
    ); 
}

export default LibraryItem;
