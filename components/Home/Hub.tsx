import { useRef } from 'react';
import { ActionIcon } from '@mantine/core';
import { useQuery } from "@tanstack/react-query";

import PlexJavascriptApi from '@/plex';

import Loader from '../shared/Loader';
import AlbumItem from '../Library/AlbumItem';

import useHubNavigation from './hooks/useHubNavigation';

import styles from './styles/Hub.module.css'

import HubLeftIcon from '@/assets/hubScrollLeft.svg'
import HubRightIcon from '@/assets/hubScrollRight.svg'

type HubProps = {
    title: string,
    section: string,
    type: number,
    sort: string,
    count?: number
}

function Hub({ title, section, type, sort, count = 10 }: HubProps) {

    const containerRef = useRef(null as HTMLDivElement | null);
    const contentRef = useRef(null as HTMLDivElement | null);

    const { isFetching: hubLoading, data } = useQuery({
        queryKey: ['hub', section, sort],
        queryFn: () => PlexJavascriptApi.getLibraryHubItems(section, type, {
            'X-Plex-Container-Start': 0,
            'X-Plex-Container-Size': count,
            sort: sort,
        }),
        enabled: !!section
    });

    const { leftScrollDisabled, rightScrollDisabled, advanceRight, advanceLeft  } = useHubNavigation({ containerRef, contentRef });

    let hubItems = data;
    if (!hubItems) hubItems = [];
    
    return (
        <div className={'hub'}>
            <div className={`${styles.title}`}>{title}</div>
            <div className={`${styles.nav_container}`}>
                <ActionIcon className={`${styles.action_button}`} onClick={() => advanceLeft()} title={'Advance Left'} disabled={leftScrollDisabled} variant="transparent" size="lg" color="dark">
                    <HubLeftIcon />
                </ActionIcon>
                <ActionIcon className={`${styles.action_button}`} onClick={() => advanceRight()} title={'Advance Right'} disabled={rightScrollDisabled} variant="transparent" size="lg" color="dark">
                    <HubRightIcon  />
                </ActionIcon>
            </div>
            <div ref={containerRef} className={`${styles.hub_scroller}`}>
                <Loader loading={hubLoading} />
                {!hubLoading && (
                    <div ref={contentRef} className={`${styles.hub_content}`}>
                        {hubItems.map((item) => (
                            <AlbumItem key={item.ratingKey} metadata={item} showAuthor />
                        ))}
                    </div>
                )}
            </div> 
        </div>
    );
}

export default Hub;