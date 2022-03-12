import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

const Container = styled.div`
    background-color: rgba(75,85,99,1);
    color: #fff;
    box-shadow: 0 5px 15px 15px rgba(75,85,99, 0.4);
    margin-bottom: 15px;
`;

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
    min-height: 1.25rem;
`;

const Subheader = ({ hideServer, children }) => {

    const [displayName, setDisplayName] = useState('');

    const server = useSelector(state => state.settings.currentServer);
    const librarySection = useSelector(state => state.settings.librarySection);
    const libraries = useSelector(state => state.settings.libraries);
    useEffect(() => {
        if (!!hideServer) setDisplayName('');
        else if (server) {
            if (libraries && librarySection) {
                const libraryName = libraries.filter(library => {
                    if (library.key === librarySection) return true;
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
    }, [server]);

    return (
        <Container>
            <InnerContainer>
                <Item>{displayName}</Item>
                <Item>{children}</Item>
            </InnerContainer>
        </Container>
    ); 
}

export default Subheader;
