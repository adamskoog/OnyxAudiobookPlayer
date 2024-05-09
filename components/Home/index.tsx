'use client'
import PlexJavascriptApi from "@/plex";
import { useAppSelector } from "@/store";

import type { PlexAlbumMetadata } from "@/types/plex.types";

import Hub from "./Hub";

function HomePage() {
    
    const userInfo = useAppSelector((state) => state.application.user);
    const activeServer = useAppSelector(state => state.server.activeServer);
    const section = useAppSelector((state) => state.library.libraryId);
  
    const fetchRecentAddedItems = async (): Promise<Array<PlexAlbumMetadata>> => {
      if (!section) return [];
      return await PlexJavascriptApi.getLibraryHubItems(section, {
        'X-Plex-Container-Start': 0,
        'X-Plex-Container-Size': 10,
        sort: 'addedAt:desc',
      });
    };

    const fetchRecentPlayedItems = async (): Promise<Array<PlexAlbumMetadata>> => {
        if (!section) return [];
        return await PlexJavascriptApi.getLibraryHubItems(section, {
          'X-Plex-Container-Start': 0,
          'X-Plex-Container-Size': 10,
          sort: 'lastViewedAt:desc',
        });
    };

    return (
        <>
            {userInfo && activeServer && (
              <>
              <Hub title="Recently Played" hubItemsCallback={fetchRecentPlayedItems}/>
              <Hub title="Recently Added" hubItemsCallback={fetchRecentAddedItems}/>
              </>
            )}
        </>
    );
}

export default HomePage;