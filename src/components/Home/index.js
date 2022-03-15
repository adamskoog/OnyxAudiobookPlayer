import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

import { ScrollContent  } from '../util/container';

import { getLibraryItems } from '../../plex/Api';

import Subheader from '../Header/Subheader';
import Hub from './Hub';

const ErrorMessage = styled.div`
    margin: 30px;
`;

const Home = () => {
 
    const userInfo = useSelector(state => state.application.user);
    const baseUrl = useSelector(state => state.application.baseUrl);
    const section = useSelector(state => state.settings.librarySection);
    const accessToken = useSelector(state => state.settings.accessToken);

    const [recentlyAddedInfo, setRecentlyAddedInfo] = useState([]);
    const [recentlyPlayedInfo, setRecentlyPlayedInfo] = useState([]);

    const isMountedRef = useRef(true)
    useEffect(() => () => { isMountedRef.current = false }, [])

    useEffect(() => {
        if (baseUrl && section) {
            const fetchLibraryItems = async () => {
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
        {(!baseUrl || !section) && (
            <ErrorMessage>Failed to load library, please update your settings.</ErrorMessage>
        )}
        {accessToken && baseUrl && section &&(
            <>
            <Subheader></Subheader>
            <ScrollContent>
                {recentlyAddedInfo.length > 0 && (
                <Hub title="Recently Added" items={recentlyAddedInfo} />
                )}
                {recentlyPlayedInfo.length > 0 && (
                <Hub title="Recently Played" items={recentlyPlayedInfo} />
                )}
            </ScrollContent>
            </>
        )}
        </>
    ); 
}

export default Home;
