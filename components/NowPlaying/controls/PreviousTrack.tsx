import { memo, useEffect } from 'react';
import BaseControl from './BaseControl';

import { createSelector } from '@reduxjs/toolkit';
import { useAppSelector, useAppDispatch, RootState } from '@/store';
import { previousTrack } from '@/store/features/playerSlice';

function PreviousTrackControl() {

    const dispatch = useAppDispatch();
    const isFirstTrack = useAppSelector(createSelector(
        (state: RootState) => state.player.isFirstTrack, 
        (isFirstTrack): boolean => { return isFirstTrack}
    ));

    useEffect(() => {
        if (!isFirstTrack) navigator.mediaSession.setActionHandler('previoustrack', () => { dispatch(previousTrack()) });
        else navigator.mediaSession.setActionHandler('previoustrack', null);
    }, [isFirstTrack]);

    return (
        <BaseControl disabled={isFirstTrack} title={'Previous Track'} onClick={() => dispatch(previousTrack())}>
            <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-skip-start-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M4.5 3.5A.5.5 0 0 0 4 4v8a.5.5 0 0 0 1 0V4a.5.5 0 0 0-.5-.5z"/>
                <path d="M4.903 8.697l6.364 3.692c.54.313 1.232-.066 1.232-.697V4.308c0-.63-.692-1.01-1.232-.696L4.903 7.304a.802.802 0 0 0 0 1.393z"/>
            </svg>
        </BaseControl>
    );
}

export default memo(PreviousTrackControl);