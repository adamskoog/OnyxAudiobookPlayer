import React from 'react';
import { Link } from 'react-router-dom';
import PlexApi from '../../plex/Api';

function LibraryItem(props) {
    return (
        <div>
            <Link to={`/album/${props.albumInfo.ratingKey}`}>
                <img src={PlexApi.getThumbnailTranscodeUrl(200, 200, props.baseUrl, props.albumInfo.thumb,  props.userInfo.authToken)} alt="Album Cover" loading="lazy" />
                <div className="mt-1">{props.albumInfo.title}</div>
                <div>{props.albumInfo.parentTitle}</div>
            </Link>
        </div>
    ); 
}

export default LibraryItem;
