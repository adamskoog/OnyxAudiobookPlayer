import { Component } from 'react';
import PropTypes from 'prop-types';
import TimeUtils from '../utility/time';
import AlbumHelpers from '../plex/AlbumHelpers';

// trackInfo.viewOffset = the location in the track
//      this seems to not be complete in most cases, not the full track length.
//      need to determine how to handle this
// trackInfo.viewCount = the play count of the file
// trackInfo.duration = the length of the track, seconds?
class AlbumTrack extends Component {

    trackClass = () => {
        var output = ["album-track"];
        if (this.props.trackInfo.viewOffset) {
            if (AlbumHelpers.trackIsComplete(this.props.trackInfo.viewOffset, this.props.trackInfo.duration)) {
                output.push("complete");
            } else {
                output.push("in-progress");
            }
        }
        return output.join(" ");
    }

    render() {
        //console.log("Track Render", this.props.trackInfo);
        return (
            <tr className={this.trackClass()}>
                <td className="col-track-play">
                    <button className="btn btn-track-play" type="button" onClick={() => this.props.plexSelectedTrack(this.props.trackInfo)}>
                        <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-x-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                            <path fillRule="evenodd" d="m 12.654334,8.697 -6.3630006,3.692 c -0.54,0.313 -1.233,-0.066 -1.233,-0.697 V 4.308 c 0,-0.63 0.692,-1.01 1.233,-0.696 l 6.3630006,3.692 a 0.802,0.802 0 0 1 0,1.393 z"/>
                        </svg>
                    </button>
                </td>
                <td className="col-track-index">
                    <div className="album-track-index">{this.props.trackInfo.index}</div>
                </td>
                <td>{this.props.trackInfo.title}</td>
                <td className="col-track-duration">{TimeUtils.formatTrackDisplay(this.props.trackInfo.duration)}</td>
            </tr>
        ); 
    }
}

AlbumTrack.propTypes = {
    trackInfo: PropTypes.object.isRequired,
    plexSelectedTrack: PropTypes.func.isRequired
}

export default AlbumTrack;
