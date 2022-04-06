import React, {
  useEffect, useRef, ReactElement,
} from 'react';
import styled from 'styled-components';

import { useAppSelector } from '../../context/hooks';
import { PlexServerApi } from '../../plex/Api';

import Hub from './Hub';

const ErrorMessage = styled.div`
    margin: 30px;
`;

function Home(): ReactElement {

  const userInfo = useAppSelector((state) => state.application.user);
  const section = useAppSelector((state) => state.settings.librarySection);
  
  const isMountedRef = useRef(true);
  useEffect(() => () => { isMountedRef.current = false; }, []);

  const fetchRecentAddedItems = async (): Promise<void> => {
    const data = await PlexServerApi.getLibraryHubItems(section, {
      'X-Plex-Container-Start': 0,
      'X-Plex-Container-Size': 10,
      sort: 'addedAt:desc',
    });
    if (data.Metadata && isMountedRef.current) return data.Metadata
    return [] as any;
  }; 

  const fetchRecentPlayedItems = async (): Promise<void> => {
    const data = await PlexServerApi.getLibraryHubItems(section, {
      'X-Plex-Container-Start': 0,
      'X-Plex-Container-Size': 10,
      sort: 'lastViewedAt:desc',
    });
    if (data.Metadata && isMountedRef.current) return data.Metadata
    return [] as any;
  };

  return (
    <>
      {userInfo && (
        <>
          <Hub title="Recently Added" getItems={fetchRecentAddedItems}/>
          <Hub title="Recently Played" getItems={fetchRecentPlayedItems}/>
        </>
      )}
    </>
  );
}

export default Home;
