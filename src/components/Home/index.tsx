import React, {
  useState, useEffect, useRef, ReactElement,
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
  const applicationState = useAppSelector((state) => state.application.applicationState);

  const [recentlyAddedInfo, setRecentlyAddedInfo] = useState([]);
  const [recentlyPlayedInfo, setRecentlyPlayedInfo] = useState([]);

  const isMountedRef = useRef(true);
  useEffect(() => () => { isMountedRef.current = false; }, []);

  useEffect(() => {
    if (applicationState === 'ready' && section) {
      const fetchLibraryItems = async (): Promise<void> => {
        const data = await PlexServerApi.getLibraryHubItems(section, {
          'X-Plex-Container-Start': 0,
          'X-Plex-Container-Size': 10,
          sort: 'addedAt:desc',
        });
        if (data.Metadata && isMountedRef.current) setRecentlyAddedInfo(data.Metadata);
      }; 
      fetchLibraryItems();
    } else setRecentlyAddedInfo([]);
  }, [applicationState, section]);

  useEffect(() => {
    if (applicationState === 'ready' && section) {
      const fetchLibraryItems = async (): Promise<void> => {
        const data = await PlexServerApi.getLibraryHubItems(section, {
          'X-Plex-Container-Start': 0,
          'X-Plex-Container-Size': 10,
          sort: 'lastViewedAt:desc',
        });
        if (data.Metadata && isMountedRef.current) setRecentlyPlayedInfo(data.Metadata);
      };
      fetchLibraryItems();
    } else setRecentlyPlayedInfo([]);
  }, [applicationState, section]);

  return (
    <>
      {userInfo && applicationState === 'ready' && (
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
  );
}

export default Home;
