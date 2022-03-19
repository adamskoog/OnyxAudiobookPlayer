import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { useAppSelector } from '../../context/hooks';

const Container = styled.div`
    background-color: ${({ theme }) => theme.SUBHEADER_BG};
    color: ${({ theme }) => theme.SUBHEADER_TEXT};
`;
//box-shadow: 0 5px 15px 15px ${({ theme }) => theme.SUBHEADER_SHADOW};
const InnerContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;

    max-width: 80rem;
    margin-left: auto;
    margin-right: auto;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    padding-top: .75rem;
    padding-bottom: .75rem;
`;

const Item = styled.div`
    display: flex;
    flex-grow: 1;
    min-height: 1.5rem;
`;

const RightItem = styled(Item)`
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 1rem;
`;

type Props = {
    hideServer?: boolean
    children: any
}
const Subheader = ({ hideServer, children }: Props) => {

    const [displayName, setDisplayName] = useState('');

    const server = useAppSelector(state => state.settings.currentServer);
    const librarySection = useAppSelector(state => state.settings.librarySection);
    const libraries = useAppSelector(state => state.settings.libraries);

    useEffect(() => {
        if (!!hideServer) setDisplayName('');
        else if (server) {
            if (libraries && librarySection) {
                const libraryName = libraries.filter((library: any) => {
                    if (library.key === librarySection) return true;
                    return false;
                });
                if (libraryName.length > 0) {
                    setDisplayName(`${server.name}: ${libraryName[0].title}`);
                } else {
                    setDisplayName(`${server.name}: Title Not Found`);
                }
            } else
                setDisplayName(`${server.name}: Library Not Set`);
        } else
            setDisplayName('Server: Not Set');
    }, [server, librarySection, libraries, hideServer]);

    return (
        <Container>
            <InnerContainer>
                <Item>{displayName}</Item>
                <RightItem>{children}</RightItem>
            </InnerContainer>
        </Container>
    ); 
}

export default Subheader;