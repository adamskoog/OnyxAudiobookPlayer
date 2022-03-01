import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

import PlexApi from '../../plex/Api';

import Hub from './Hub';

const ErrorMessage = styled.div`
    margin: 30px;
`;

const Home = ({ baseUrl, section, userInfo }) => {
 
    const [recentlyAddedInfo, setRecentlyAddedInfo] = useState([]);
    const [recentlyPlayedInfo, setRecentlyPlayedInfo] = useState([]);

    const isMountedRef = useRef(true)
    useEffect(() => () => { isMountedRef.current = false }, [])

    useEffect(() => {
        if (userInfo && baseUrl && section) {
            PlexApi.getLibraryItems(baseUrl, section, { 
                "X-Plex-Token": userInfo.authToken,
                "X-Plex-Container-Start": 0,
                "X-Plex-Container-Size": 10,
                sort: "addedAt:desc"
            })
                .then(data => {
                    if (data.MediaContainer.Metadata && isMountedRef.current)
                        setRecentlyAddedInfo(data.MediaContainer.Metadata);
                });
        } else {
            setRecentlyAddedInfo([]);
        }
    }, [baseUrl, section, userInfo]);

    useEffect(() => {
        if (userInfo && baseUrl && section) {
            PlexApi.getLibraryItems(baseUrl, section, { 
                "X-Plex-Token": userInfo.authToken,
                "X-Plex-Container-Start": 0,
                "X-Plex-Container-Size": 10,
                sort: "lastViewedAt:desc"
            })
                .then(data => {
                    if (data.MediaContainer.Metadata && isMountedRef.current)
                        setRecentlyPlayedInfo(data.MediaContainer.Metadata);
                });
        } else {
            setRecentlyPlayedInfo([]);
        }
    }, [baseUrl, section, userInfo]);

    return (
        <>
        {!userInfo && (
            <ErrorMessage>Must login to view library.</ErrorMessage>
        )}
        {(!baseUrl || !section) && (
            <ErrorMessage>Failed to load library, please update your settings.</ErrorMessage>
        )}
        {userInfo && baseUrl && (
            <>
                <Hub title="Recently Added" baseUrl={baseUrl} userInfo={userInfo} items={recentlyAddedInfo} />
                <Hub title="Recently Played" baseUrl={baseUrl} userInfo={userInfo} items={recentlyPlayedInfo} />
            </>
        )}
        </>
    ); 
}

export default Home;
