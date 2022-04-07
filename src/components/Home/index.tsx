import React, { ReactElement } from 'react';

import { useAppSelector } from '../../context/hooks';
import { PlexServerApi } from '../../plex/Api';

import Hub from './Hub';

function Home(): ReactElement {

  const userInfo = useAppSelector((state) => state.application.user);
  const section = useAppSelector((state) => state.settings.librarySection);

  const fetchRecentAddedItems = async (): Promise<Array<PlexAlbumMetadata>> => {
    if (!section) return [];
    return await PlexServerApi.getLibraryHubItems(section, {
      'X-Plex-Container-Start': 0,
      'X-Plex-Container-Size': 10,
      sort: 'addedAt:desc',
    });
  };

  const fetchRecentPlayedItems = async (): Promise<Array<PlexAlbumMetadata>> => {
    if (!section) return [];
    return await PlexServerApi.getLibraryHubItems(section, {
      'X-Plex-Container-Start': 0,
      'X-Plex-Container-Size': 10,
      sort: 'lastViewedAt:desc',
    });
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
