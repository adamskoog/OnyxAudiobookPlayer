'use client'
import { useAppSelector } from "@/store";

import Hub from "./Hub";

function HomePage() {
    
    const userInfo = useAppSelector((state) => state.application.user);
    const activeServer = useAppSelector(state => state.server.activeServer);
    const section = useAppSelector((state) => state.library.libraryId);
  
    return (
        <>
            {userInfo && activeServer && (
              <>
              <Hub title="Recently Played" section={section} sort={'lastViewedAt:desc'} />
              <Hub title="Recently Added" section={section} sort={'addedAt:desc'} />
              </>
            )}
        </>
    );
}

export default HomePage;