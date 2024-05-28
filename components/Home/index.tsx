'use client'
import { useAppSelector } from "@/store";

import Hub from "./Hub";
import { MUSIC_LIBRARY_DISPAY_TYPE } from "@/utility/plex";

function HomePage() {
    
    const userInfo = useAppSelector((state) => state.application.user);
    const activeServer = useAppSelector(state => state.server.activeServer);
    const section = useAppSelector((state) => state.library.libraryId);
  
    return (
        <>
            {userInfo && activeServer && (
              <>
              <Hub title="Recently Played" section={section ?? ''} type={MUSIC_LIBRARY_DISPAY_TYPE.album.key} sort={'lastViewedAt:desc'} />
              <Hub title="Recently Added" section={section ?? ''} type={MUSIC_LIBRARY_DISPAY_TYPE.album.key} sort={'addedAt:desc'} />
              </>
            )}
        </>
    );
}

export default HomePage;