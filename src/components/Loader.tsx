import React, { ReactElement } from 'react';
import styled from 'styled-components';

const LoaderContainer: any = styled.div`
    display: ${(props: any) => ((props.isLoading) ? 'flex' : 'none')};
    align-items: center;
    justify-content: center;
    z-index: ${(props: any) => ((props.zIndex) ? props.zIndex : '50' )};
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${({ theme }) => theme.NAV_BACKGROUND};

    ${(props: any) => (props.hideBackground) ? `background-color: ${props.theme.BODY_BG};` : ''}
`;

const InnerContainer = styled.div`
    width: 100%;
`;

const Spinner = styled.div`
    margin: auto;
    
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

type Props = {
  isLoading: boolean,
  hideBackground?: boolean,
  zIndex?: number
}
function Loader({ isLoading, zIndex, hideBackground }: Props): ReactElement {
  return (
    <LoaderContainer isLoading={isLoading} zIndex={zIndex} hideBackground={hideBackground}>
      <InnerContainer>
        <Spinner role="status" />
      </InnerContainer>
    </LoaderContainer>
  );
}

export default Loader;
