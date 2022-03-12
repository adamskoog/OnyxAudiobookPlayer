import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

import { ScrollContent  } from '../util/container';

import { getLibraryItems } from '../../plex/Api';

import Subheader from '../Header/Subheader';
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
            const fetchLibraryItems = async () => {
                const data = await getLibraryItems(baseUrl, section, { 
                    "X-Plex-Token": userInfo.authToken,
                    "X-Plex-Container-Start": 0,
                    "X-Plex-Container-Size": 10,
                    sort: "addedAt:desc"
                });
                if (data.MediaContainer.Metadata && isMountedRef.current)
                    setRecentlyAddedInfo(data.MediaContainer.Metadata);
            }
            fetchLibraryItems();
        } else setRecentlyAddedInfo([]);
    }, [baseUrl, section, userInfo]);

    useEffect(() => {
        if (userInfo && baseUrl && section) {
            const fetchLibraryItems = async () => {
                const data = await getLibraryItems(baseUrl, section, { 
                    "X-Plex-Token": userInfo.authToken,
                    "X-Plex-Container-Start": 0,
                    "X-Plex-Container-Size": 10,
                    sort: "lastViewedAt:desc"
                });
                if (data.MediaContainer.Metadata && isMountedRef.current)
                    setRecentlyPlayedInfo(data.MediaContainer.Metadata);
            }
            fetchLibraryItems();
        } else setRecentlyPlayedInfo([]);
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
            <Subheader></Subheader>
            <ScrollContent>
                <Hub title="Recently Added" baseUrl={baseUrl} userInfo={userInfo} items={recentlyAddedInfo} />
                <Hub title="Recently Played" baseUrl={baseUrl} userInfo={userInfo} items={recentlyPlayedInfo} />
            </ScrollContent>
            </>
        )}
        </>
    ); 
}

export default Home;
