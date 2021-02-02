
import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';

const mapStateToProps = state => {
    return {
        isLoading: state.application.isLoading,
        applicationState: state.application.applicationState
    };
};

function ConnectedLoader({ isLoading, applicationState }) {

    const containerRef = useRef(null);

    useEffect(() => {
        if (isLoading) {
            containerRef.current.classList.replace("hidden", "block");
        } else {
            containerRef.current.classList.replace("block", "hidden");
        }
    }, [isLoading, applicationState]);

    return (
        <div ref={containerRef} className={"bg-gray-800 absolute z-50 top-0 bottom-0 left-0 right-0 block"}>
            <div className={"css-loader block m-auto mt-48"} role="status"></div>
        </div>
    ); 
}

const Loader = connect(mapStateToProps)(ConnectedLoader);
export default Loader;