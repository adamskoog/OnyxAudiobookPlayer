import styled from 'styled-components';

export const ScrollContainer: any = styled.div`
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden; /* Hack fix for expand button negative padding issue. */
`;

// TODO: handle responsive grid and padding - px-3 sm:px-6 lg:px-8
export const ScrollContent = styled.div`
    max-width: 80rem;
    margin-left: auto;
    margin-right: auto;
    padding-left: .25rem;
    padding-right: .25rem;
    padding-top: 1.5rem;
    padding-bottom: 1.5rem;
`;
