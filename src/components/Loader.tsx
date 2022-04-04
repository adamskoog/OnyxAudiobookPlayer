import React, { ReactElement } from 'react';
import styled from 'styled-components';

import { useAppSelector } from '../context/hooks';

const showLoading = (loading: boolean, state: string): boolean => {
  // TODO: we should utilize the state to determine when
  // this is shown.
  if (loading && state === 'loading') return true;
  return false;
};

const LoaderContainer: any = styled.div`
    display: ${(props: any) => ((showLoading(props.isLoading, props.applicationState)) ? 'block' : 'none')};
    z-index: 50;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${({ theme }: any) => theme.NAV_BACKGROUND};
`;

const Spinner = styled.div`
    margin: auto;
    margin-top: 12rem;
    
    width: 50px;
    height: 50px;
    border: 3px solid ${({ theme }: any) => theme.SPINNER};
    border-radius: 50%;
    border-top-color: #fff;
    animation: spin 1s ease-in-out infinite;

    @keyframes spin {
        to { -webkit-transform: rotate(360deg); }
    }
`;

function Loader(): ReactElement {
  const isLoading = useAppSelector((state) => state.application.isLoading);
  const applicationState = useAppSelector((state) => state.application.applicationState);

  return (
    <LoaderContainer isLoading={isLoading} applicationState={applicationState}>
      <Spinner role="status" />
    </LoaderContainer>
  );
}

export default Loader;
