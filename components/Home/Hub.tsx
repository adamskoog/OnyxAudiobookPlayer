import { useRef } from 'react';
import { ActionIcon } from '@mantine/core';

import type { PlexAlbumMetadata } from "@/types/plex.types";

import Loader from '../shared/Loader';
import AlbumItem from '../Library/AlbumItem';

import useHubItems from "./hooks/useHubItems";
import useHubNavigation from './hooks/useHubNavigation';

import styles from './styles/Hub.module.css'

import HubLeftIcon from '@/assets/hubScrollLeft.svg'
import HubRightIcon from '@/assets/hubScrollRight.svg'

type HubProps = {
    title: string,
    hubItemsCallback: () => Promise<Array<PlexAlbumMetadata>>
}

function Hub({ title, hubItemsCallback }: HubProps) {

    const containerRef = useRef(null as HTMLDivElement | null);
    const contentRef = useRef(null as HTMLDivElement | null);

    const { hubLoading, hubItems } = useHubItems({ hubItemsCallback });
    const { leftScrollDisabled, rightScrollDisabled, advanceRight, advanceLeft  } = useHubNavigation({ containerRef, contentRef });

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