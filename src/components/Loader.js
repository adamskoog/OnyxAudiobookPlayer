
import React from 'react';
import styled from 'styled-components';

import { useSelector } from 'react-redux'

const isLoading = (loading, state) => {
    // TODO: we should utilize the state to determine when
    // this is shown.
    if (loading)
        return true;
    return false;
};

const LoaderContainer = styled.div`
    display: ${props => (isLoading(props.isLoading, props.applicationState)) ? 'block' : 'none'};
    z-index: 50;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(31, 41, 55, 1)
`;

const Spinner = styled.div`
    margin: auto;
    margin-top: 12rem;
    
    width: 50px;
    height: 50px;
    border: 3px solid rgba(255,255,255,.3);
    border-radius: 50%;
    border-top-color: #fff;
    animation: spin 1s ease-in-out infinite;

    @keyframes spin {
        to { -webkit-transform: rotate(360deg); }
    }
`;

const Loader = () => {

    const isLoading = useSelector(state => state.application.isLoading);
    const applicationState = useSelector(state => state.application.applicationState);

    return (
        <LoaderContainer isLoading={isLoading} applicationState={applicationState}>
            <Spinner role="status" />
        </LoaderContainer>
    ); 
}

export default Loader;