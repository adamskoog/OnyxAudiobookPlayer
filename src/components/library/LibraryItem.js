import React from 'react';
import { Link } from 'react-router-dom';
import PlexApi from '../../plex/Api';

function LibraryItem(props) {
    return (
        <div className="text-center">
            <Link to={`/album/${props.albumInfo.ratingKey}`}>
                <img className="shadow-xl rounded-md mb-1" src={PlexApi.getThumbnailTranscodeUrl(200, 200, props.baseUrl, props.albumInfo.thumb,  props.userInfo.authToken)} alt="Album Cover" loading="lazy" />
                <div className="truncate ..." title={props.albumInfo.title}>{props.albumInfo.title}</div>
                <div className="truncate ..." title={props.albumInfo.parentTitle}>{props.albumInfo.parentTitle}</div>
            </Link>
        </div>
    ); 
}

export default LibraryItem;
