import React, { useState, useEffect, useRef } from 'react';
import { Container, Row } from 'react-bootstrap';
import LibraryItem from './LibraryItem';
import PlexApi from '../../plex/Api';

//https://reactgo.com/javascript-get-data-from-api/
function Library(props) {
 
    const [libraryItems, setLibraryItems] = useState([]);

    // This ref is to determine if the component is mounted. When getting
    // the library items, the aync was not returning before the component was
    // updated again, this avoids trying to write to the state when not mounted.
    // TODO: it would probably be better to cancel this request when we unmount - but how??
    const isMountedRef = useRef(true)
    useEffect(() => () => { isMountedRef.current = false }, [])

    useEffect(() => {
        if (props.userInfo && props.baseUrl && props.section) {
            PlexApi.getLibraryItems(props.baseUrl, props.section, { "X-Plex-Token": props.userInfo.authToken })
                .then(data => {
                    if (data.MediaContainer.Metadata && isMountedRef.current)
                        setLibraryItems(data.MediaContainer.Metadata);
                });
        } else 
            setLibraryItems([]);
    }, [props.baseUrl, props.section, props.userInfo]);

    return (
        <React.Fragment>
        {!props.userInfo && (
            <div>Must login to view library.</div>
        )}
        {(!props.baseUrl || !props.section) && (
            <div>Failed to load library, please update your settings.</div>
        )}
        {props.userInfo && props.baseUrl && props.section && (
        <Container className="p-3">
            <Row>
                {libraryItems.map((item) => (
                    <LibraryItem key={item.key} baseUrl={props.baseUrl} userInfo={props.userInfo} albumInfo={item} />
                ))}
            </Row>
        </Container>
        )}
        </React.Fragment>
    ); 
}

export default Library;
