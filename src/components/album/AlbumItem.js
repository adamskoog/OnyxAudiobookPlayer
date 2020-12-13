import React from 'react';
import TimeUtils from '../../utility/time';
import AlbumHelpers from '../../plex/AlbumHelpers';

// trackInfo.viewOffset = the location in the track
//      this seems to not be complete in most cases, not the full track length.
//      need to determine how to handle this
// trackInfo.viewCount = the play count of the file
// trackInfo.duration = the length of the track, seconds?
function AlbumItem(props) {

    const trackClass = () => {
        var output = ["album-track"];
        if (props.trackInfo.viewOffset) {
            if (AlbumHelpers.trackIsComplete(props.trackInfo.viewOffset, props.trackInfo.duration)) {
                output.push("complete");
            } else {
                output.push("in-progress");
            }
        }
        return output.join(" ");
    }

    const markPlayed = (trackInfo) => {
        AlbumHelpers.markTrackPlayed(trackInfo , props.baseUrl, props.userInfo.authToken);
    }
 
    const markUnplayed = (trackInfo) => {
        AlbumHelpers.markTrackUnplayed(trackInfo , props.baseUrl, props.userInfo.authToken);
    }

    return (
        <tr className={trackClass()}>
            <td className="col-track-play">
                <button className="btn btn-track-play" type="button" onClick={() => props.playSelectedTrack(props.trackInfo)}>
                    <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-x-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                        <path fillRule="evenodd" d="m 12.654334,8.697 -6.3630006,3.692 c -0.54,0.313 -1.233,-0.066 -1.233,-0.697 V 4.308 c 0,-0.63 0.692,-1.01 1.233,-0.696 l 6.3630006,3.692 a 0.802,0.802 0 0 1 0,1.393 z"/>
                    </svg>
                </button>
            </td>
            <td className="col-track-index">
                <div className="album-track-index">{props.trackInfo.index}</div>
            </td>
            <td className="col-track-title">{props.trackInfo.title}</td>
            <td className="col-track-duration">{TimeUtils.formatTrackDisplay(props.trackInfo.duration)}</td>
            <td className="col-track-options">
                <div className="dropdown">
                    <button className="btn" type="button" id={`trackOptions${props.trackInfo.ratingKey}`} data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-three-dots-vertical" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                        </svg>
                    </button>
                    <div className="dropdown-menu" aria-labelledby={`trackOptions${props.trackInfo.ratingKey}`}>
                        <button className="dropdown-item" type="button" onClick={() => markPlayed(props.trackInfo)}>Mark as Played</button>
                        <button className="dropdown-item" type="button" onClick={() => markUnplayed(props.trackInfo)}>Mark as Unplayed</button>
                    </div>
                </div>
            </td>
        </tr>
    ); 
}

export default AlbumItem;
