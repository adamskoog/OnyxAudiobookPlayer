import { useRouter } from 'next/router';

import { Inter } from 'next/font/google'

import styles from './styles/Subheader.module.css'

import ServerInfo from './ServerInfo';
import LibraryFilters from './LibraryFilters';

const inter = Inter({ subsets: ['latin'] })

function Subheader() {

    const router = useRouter();

    return (
        <section className={`${styles.container} ${inter.className}`}>
            <div className={`${styles.inner}`}>
                <ServerInfo />
                {router.pathname === '/library' && (
                    <LibraryFilters />
                )}
            </div>
        </section>
    );
}

export default Subheader;