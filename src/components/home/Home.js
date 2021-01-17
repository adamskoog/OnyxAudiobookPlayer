import React, { useState, useEffect, useRef } from 'react';
import PlexApi from '../../plex/Api';

import Hub from './Hub';

function Home(props) {
 
    const [recentlyAddedInfo, setRecentlyAddedInfo] = useState([]);
    const [recentlyPlayedInfo, setRecentlyPlayedInfo] = useState([]);

    // https://www.npmjs.com/package/react-horizontal-scrolling-menu
    const isMountedRef = useRef(true)
    useEffect(() => () => { isMountedRef.current = false }, [])

    useEffect(() => {
        if (props.userInfo && props.baseUrl && props.section) {
            PlexApi.getSectionHubs(props.baseUrl, props.section, props.userInfo.authToken)
                .then(data => {
                    if (data.MediaContainer && data.MediaContainer.Hub) {
                        for (let i = 0; i < data.MediaContainer.Hub.length; i++) {
                            const hub = data.MediaContainer.Hub[i];
                            if (hub.context ==="hub.music.recent.added") {
                                setRecentlyAddedInfo(hub.Metadata);
                            }
                        }
                    } else {
                        setRecentlyAddedInfo([]);
                    }
                });
        } else {
            setRecentlyAddedInfo([]);
        }
    }, [props.baseUrl, props.section, props.userInfo]);

    useEffect(() => {
        if (props.userInfo && props.baseUrl && props.section) {
            PlexApi.getLibraryItems(props.baseUrl, props.section, { 
                "X-Plex-Token": props.userInfo.authToken,
                "X-Plex-Container-Start": 0,
                "X-Plex-Container-Size": 10
            }, "lastViewedAt:desc")
                .then(data => {
                    if (data.MediaContainer.Metadata && isMountedRef.current)
                        setRecentlyPlayedInfo(data.MediaContainer.Metadata);
                });
        } else {
            setRecentlyPlayedInfo([]);
        }
    }, [props.baseUrl, props.section, props.userInfo]);

    return (
        <React.Fragment>
        {!props.userInfo && (
            <div>Must login to view library.</div>
        )}
        {(!props.baseUrl || !props.section) && (
            <div>Failed to load library, please update your settings.</div>
        )}
        {props.userInfo && props.baseUrl && (
            <React.Fragment>
                <Hub title="Recently Added" baseUrl={props.baseUrl} userInfo={props.userInfo} items={recentlyAddedInfo} />
                <Hub title="Recently Played" baseUrl={props.baseUrl} userInfo={props.userInfo} items={recentlyPlayedInfo} />
            </React.Fragment>
        )}
        </React.Fragment>
    ); 
}

export default Home;
