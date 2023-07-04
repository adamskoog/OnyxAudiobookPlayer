import { useEffect, useState } from 'react';
import { useAppSelector } from '@/store'

import styles from './styles/ServerInfo.module.css'

function ServerInfo() {

    const [displayName, setDisplayName] = useState<string>('');

    const appState = useAppSelector((state) => state.application.state);
    const serverLoading = useAppSelector((state) => state.server.isLoading);
    const server = useAppSelector((state) => state.server.activeServer);
    const libraries = useAppSelector((state) => state.server.libraries);
    const librarySection = useAppSelector((state) => state.library.libraryId);

    useEffect(() => {
        if (appState === 'loading' || serverLoading)
          setDisplayName(`Loading...`);
        else if (server) {
          if (libraries && librarySection) {
            const libraryName = libraries.filter((library) => {
              if (library.key === librarySection) return true;
              return false;
            });
            if (libraryName.length > 0) {
              setDisplayName(`${server.name}: ${libraryName[0].title}`);
            } else {
              setDisplayName(`${server.name}: Title Not Found`);
            }
          } else setDisplayName(`${server.name}: Library Not Set`);
        } else setDisplayName('Server: Not Set');
    }, [appState, serverLoading, server, librarySection, libraries]);

    return (
        <div className={`${styles.server}`}>{displayName}</div>
    );
}

export default ServerInfo;