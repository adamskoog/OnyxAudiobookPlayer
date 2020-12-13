
import React from 'react';
import { connect } from 'react-redux';

import * as playQueueActions from "../../../context/actions/playQueueActions";

const mapStateToProps = state => {
    return { 
        queueIndex: state.playQueue.index,
        queue: state.playQueue.queue
    };
};

 const mapDispatchToProps = dispatch => {
    return {
        nextTrackInQueue: () => dispatch(playQueueActions.nextTrackInQueue())
    };
};

function ConnectedNexTrackControl(props) {

    const hasNextTrack = () => {
        let newTrackIndex = props.queueIndex + 1;
        if (newTrackIndex < props.queue.length) {
            return true;
        }
        return false;
    };

    return (
        <React.Fragment>
            <button className="btn btn-player-next-track" type="button" disabled={!hasNextTrack()} onClick={() => props.nextTrackInQueue()}>
            <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-skip-end-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M12 3.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5z"/>
                <path d="M11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
            </svg>
            </button>
        </React.Fragment>
    ); 
}

const NexTrackControl = connect(mapStateToProps, mapDispatchToProps)(ConnectedNexTrackControl);
export default NexTrackControl;