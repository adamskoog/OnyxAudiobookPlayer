import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

import { useAppSelector } from '../../context/hooks';
import { getLibraryItems } from '../../plex/Api';

import Hub from './Hub';

const ErrorMessage = styled.div`
    margin: 30px;
`;

const Home = () => {
 
    const userInfo = useAppSelector(state => state.application.user);
    const baseUrl = useAppSelector(state => state.application.baseUrl);
    const section = useAppSelector(state => state.settings.librarySection);
    const accessToken = useAppSelector(state => state.settings.accessToken);

    const [recentlyAddedInfo, setRecentlyAddedInfo] = useState([]);
    const [recentlyPlayedInfo, setRecentlyPlayedInfo] = useState([]);

    const isMountedRef = useRef(true)
    useEffect(() => () => { isMountedRef.current = false }, [])

    useEffect(() => {
        if (baseUrl && section) {
            const fetchLibraryItems = async () => {
                if (!baseUrl || !section || !accessToken) return;
                const data = await getLibraryItems(baseUrl, section, { 
                    "X-Plex-Token": accessToken,
                    "X-Plex-Container-Start": 0,
                    "X-Plex-Container-Size": 10,
                    sort: "addedAt:desc"
                });
                if (data.MediaContainer.Metadata && isMountedRef.current)
                    setRecentlyAddedInfo(data.MediaContainer.Metadata);
            }
            fetchLibraryItems();
        } else setRecentlyAddedInfo([]);
    }, [baseUrl, section, accessToken]);

    useEffect(() => {
        if (baseUrl && section) {
            const fetchLibraryItems = async () => {
                const data = await getLibraryItems(baseUrl, section, { 
                    "X-Plex-Token": accessToken,
                    "X-Plex-Container-Start": 0,
                    "X-Plex-Container-Size": 10,
                    sort: "lastViewedAt:desc"
                });
                if (data.MediaContainer.Metadata && isMountedRef.current)
                    setRecentlyPlayedInfo(data.MediaContainer.Metadata);
            }
            fetchLibraryItems();
        } else setRecentlyPlayedInfo([]);
    }, [baseUrl, section, accessToken]);

    return (
        <>
        {!userInfo && (
            <ErrorMessage>Must login to view library.</ErrorMessage>
        )}
        {userInfo && (
            <>
            {accessToken && baseUrl && (
                <>
                {recentlyAddedInfo.length > 0 && (
                <Hub title="Recently Added" items={recentlyAddedInfo} />
                )}
                {recentlyPlayedInfo.length > 0 && (
                <Hub title="Recently Played" items={recentlyPlayedInfo} />
                )}
                </>
            )}
            </>
        )}
        </>
    ); 
}

export default Home;
