import React, { useState, useEffect } from 'react';
import { Container, Row } from 'react-bootstrap';
import AlbumItem from './AlbumListItem';
import PlexRequest from '../plex/PlexRequest';
import { Redirect } from 'react-router-dom';

//https://reactgo.com/javascript-get-data-from-api/
function Library(props) {
 
    const [libraryItems, setLibraryItems] = useState([]);

    useEffect(() => {
        if (props.userInfo && props.baseUrl && props.section) {
            PlexRequest.getLibraryItems(props.baseUrl, props.section, { "X-Plex-Token": props.userInfo.authToken })
                .then(data => {
                    if (data.MediaContainer.Metadata)
                        setLibraryItems(data.MediaContainer.Metadata);
                });
        } else 
            setLibraryItems([]);
    }, [props.baseUrl, props.section, props.userInfo]);

    return (
        <React.Fragment>
        {!props.userInfo && (
            <Redirect to="/" />
        )}
        {(!props.baseUrl || !props.section) && (
            <div>Failed to load library, please update your settings.</div>
        )}
        {props.userInfo && props.baseUrl && props.section && (
        <Container className="p-3">
            <Row>
                {libraryItems.map((item) => (
                    <AlbumItem key={item.key} baseUrl={props.baseUrl} userInfo={props.userInfo} albumInfo={item} />
                ))}
            </Row>
        </Container>
        )}
        </React.Fragment>
    ); 
}

export default Library;
