import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import * as Responsive from '../util/responsive';

import FilterMenu from './FilterMenu';
import LibraryItem from './LibraryItem';
import { ScrollContainer, ScrollContent  } from '../util/container';
import { getLibraryItems } from '../../plex/Api';

const Grid = styled.div`
    display: grid;
    grid-gap: 1rem;
    gap: 1rem;
    align-items: center;
    justify-items: center;

    grid-template-columns: repeat(2, minmax(0, 1fr));

    ${Responsive.smallMediaQuery(`
        grid-template-columns: repeat(3, minmax(0, 1fr));
    `)}
    ${Responsive.mediumMediaQuery(`
        grid-template-columns: repeat(4, minmax(0, 1fr));;
    `)}
    ${Responsive.largeMediaQuery(`
        grid-template-columns: repeat(5, minmax(0, 1fr));
    `)}
    ${Responsive.xlMediaQuery(`
        grid-template-columns: repeat(6, minmax(0, 1fr));
    `)}
`;

const ErrorMessage = styled.div`
    margin: 30px;
`;

//https://reactgo.com/javascript-get-data-from-api/
const Library = ({ userInfo, baseUrl, section }) => {
 
    const [libraryItems, setLibraryItems] = useState([]);

    // This ref is to determine if the component is mounted. When getting
    // the library items, the aync was not returning before the component was
    // updated again, this avoids trying to write to the state when not mounted.
    // TODO: it would probably be better to cancel this request when we unmount - but how??
    const isMountedRef = useRef(true)
    useEffect(() => () => { isMountedRef.current = false }, [])

    useEffect(() => {
        if (userInfo && baseUrl && section) {
            const fetchLibraryItems = async () => {
                const data = await getLibraryItems(baseUrl, section, { "X-Plex-Token": userInfo.authToken });
                if (data.MediaContainer.Metadata && isMountedRef.current)
                    setLibraryItems(data.MediaContainer.Metadata);
            }
            fetchLibraryItems();
        } else setLibraryItems([]);
    }, [baseUrl, section, userInfo]);

    return (
        <>
        {!userInfo && (
            <ErrorMessage>Must login to view library.</ErrorMessage>
        )}
        {(!baseUrl || !section) && (
            <ErrorMessage>Failed to load library, please update your settings.</ErrorMessage>
        )}
        {userInfo && baseUrl && section && (
            <>
            <FilterMenu />
            {/* <ScrollContainer> TODO: determine how to conditionally size the parent to account for this. */}
            <ScrollContent>
                <Grid>
                    {libraryItems.map((item) => (
                        <LibraryItem key={item.key} baseUrl={baseUrl} userInfo={userInfo} albumInfo={item} />
                    ))}
                </Grid>
            </ScrollContent>
            {/* </ScrollContainer> */}
            </>
        )}
        </>
    ); 
}

export default Library;
