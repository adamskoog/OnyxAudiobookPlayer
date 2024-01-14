import { useEffect } from 'react';
import BaseControl from './BaseControl';

import { createSelector } from '@reduxjs/toolkit';
import { useAppSelector, useAppDispatch, RootState } from '@/store';
import { nextTrack } from '@/store/features/playerSlice';

function NexTrackControl() {

    const dispatch = useAppDispatch();
    const isLastTrack = useAppSelector(createSelector(
        (state: RootState) => state.player.isLastTrack, 
        (isLastTrack): boolean => { return isLastTrack}
    ));

    useEffect(() => {
        if (!isLastTrack) navigator.mediaSession.setActionHandler('nexttrack', () => { dispatch(nextTrack()) });
        else navigator.mediaSession.setActionHandler('nexttrack', null);
    }, [isLastTrack]);

    return (
        <BaseControl disabled={isLastTrack} title={'Next Track'} onClick={() => dispatch(nextTrack())}>
            <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-skip-end-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M12 3.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5z"/>
                <path d="M11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
            </svg>
        </BaseControl>
    );
}

export default NexTrackControl;
