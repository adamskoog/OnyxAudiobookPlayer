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
  const baseUrl = useAppSelector((state) => state.application.baseUrl);
  const section = useAppSelector((state) => state.settings.librarySection);
  const accessToken = useAppSelector((state) => state.settings.accessToken);

  const [recentlyAddedInfo, setRecentlyAddedInfo] = useState([]);
  const [recentlyPlayedInfo, setRecentlyPlayedInfo] = useState([]);

  const isMountedRef = useRef(true);
  useEffect(() => () => { isMountedRef.current = false; }, []);

  useEffect(() => {
    if (baseUrl && section) {
      const fetchLibraryItems = async (): Promise<void> => {
        if (!baseUrl || !section || !accessToken) return;
        const data = await PlexServerApi.getLibraryHubItems(section, {
          'X-Plex-Container-Start': 0,
          'X-Plex-Container-Size': 10,
          sort: 'addedAt:desc',
        });
        if (data.Metadata && isMountedRef.current) setRecentlyAddedInfo(data.Metadata);
      };
      fetchLibraryItems();
    } else setRecentlyAddedInfo([]);
  }, [baseUrl, section, accessToken]);

  useEffect(() => {
    if (baseUrl && section) {
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
  }, [baseUrl, section, accessToken]);

  return (
    <>
      {!userInfo && (
      <ErrorMessage>Must login to view library.</ErrorMessage>
      )}
      {userInfo && accessToken && baseUrl && (
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
