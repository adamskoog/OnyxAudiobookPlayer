import React from 'react';
import { connect } from 'react-redux';

const mapStateToProps = state => {
    return { 
        playState: state.player.mode
    };
};


function ConnectedSkipForwardControl(props) {

    const SKIP_TIME = 30;
    const skipForward = () => {
        props.skipForward(SKIP_TIME);
    };

    return (
        <React.Fragment>
            <button className="text-2xl mx-2 items-center focus:outline-none" type="button" onClick={() => skipForward()}>
                <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-skip-forward-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M15.5 3.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5z"/>
                    <path d="M7.596 8.697l-6.363 3.692C.693 12.702 0 12.322 0 11.692V4.308c0-.63.693-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
                    <path d="M15.096 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.693-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
                </svg>
            </button>
        </React.Fragment>
    ); 
}

const SkipForwardControl = connect(mapStateToProps)(ConnectedSkipForwardControl);
export default SkipForwardControl;