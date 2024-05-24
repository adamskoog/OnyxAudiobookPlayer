import { createSlice } from '@reduxjs/toolkit'

import { v4 as uuidv4 } from 'uuid';

import type { PlexTrack } from '@/plex/plex.types'
import type { PayloadAction } from '@reduxjs/toolkit';
import { saveSettingToStorage, SETTINGS_KEYS } from '@/utility';

export type PlayerMode = 'stopped' | 'paused' | 'playing' | 'ended';
export type PlayerView = 'minimized' | 'maximized';
export type PlayerTime = {
    current: number,
    duration: number
}
export interface PlayerState {
    mode: PlayerMode,
    view: PlayerView,
    currentTime: number | null,
    duration: number | null

    queue: Array<PlexTrack>,
    queueId: string,
    queueIndex: number,

    currentTrack: PlexTrack | null,
    isFirstTrack: boolean,
    isLastTrack: boolean,

    skipForwardIncrement: number,
    skipBackwardIncrement: number
}

const initialState: PlayerState = {
    mode: 'stopped',
    view: 'minimized',
    currentTime: null,
    duration: null,

    queue: [],
    queueId: '',
    queueIndex: -1,

    currentTrack: null,
    isFirstTrack: false,
    isLastTrack: false,

    skipForwardIncrement: 30,
    skipBackwardIncrement: 15
}

export const playerSlice = createSlice({
    name: 'player',
    initialState,
    reducers: {
        changePlayerMode: (state, action: PayloadAction<PlayerMode>) => {
            state.mode = action.payload;
        },
        changePlayerView: (state, action: PayloadAction<PlayerView>) => {
            state.view = action.payload;
        },
        setSkipBackwardIncrement: (state, action: PayloadAction<number>) => {
            saveSettingToStorage(SETTINGS_KEYS.skipBackwardIncrement, action.payload.toString())
            state.skipBackwardIncrement = action.payload;
        },
        setSkipForwardIncrement: (state, action: PayloadAction<number>) => {
            saveSettingToStorage(SETTINGS_KEYS.skipForwardIncrement, action.payload.toString())
            state.skipForwardIncrement = action.payload;
        },
        setPlayerTime: (state, action: PayloadAction<PlayerTime>) => {
            state.currentTime = action.payload.current;
            state.duration = action.payload.duration;
        },
        buildPlayQueue: (state, action: PayloadAction<PlexTrack[]>) => {
            state.queueId = uuidv4();
            state.queue = action.payload;
            state.queueIndex = 0
            state.currentTrack = action.payload[0]

            state.isFirstTrack = true;
            state.isLastTrack = action.payload.length === 1;
        },
        previousTrack: (state) => {
            if (state.queueIndex > 0) {
                const newIndex = state.queueIndex - 1;
                
                state.queueIndex = newIndex;
                state.currentTrack = state.queue[newIndex];

                state.isFirstTrack = newIndex === 0;
                state.isLastTrack = newIndex === (state.queue.length - 1);
            }
        },
        nextTrack: (state) => {
            if (state.queueIndex < state.queue.length) {
                const newIndex = state.queueIndex + 1;

                state.queueIndex = newIndex;
                state.currentTrack = state.queue[newIndex];

                state.isFirstTrack = newIndex === 0;
                state.isLastTrack = newIndex === (state.queue.length - 1);
            }
        },
        clearPlayQueue: (state) => {
            state.queue = [];
            state.queueId = '';
            state.queueIndex = -1;
            state.currentTrack = null;
            state.isFirstTrack = false;
            state.isLastTrack = false;
        }
    }
})

// Action creators are generated for each case reducer function
export const { changePlayerMode, changePlayerView, setSkipBackwardIncrement, setSkipForwardIncrement, setPlayerTime, previousTrack, nextTrack, buildPlayQueue, clearPlayQueue } = playerSlice.actions

export default playerSlice.reducer