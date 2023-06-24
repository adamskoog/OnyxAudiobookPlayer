import { createSlice } from '@reduxjs/toolkit'

import { v4 as uuidv4 } from 'uuid';

import type { PlexTrack } from '@/types/plex.types'
import type { PayloadAction } from '@reduxjs/toolkit';

export type PlayerMode = 'stopped' | 'paused' | 'playing';
export type PlayerTime = {
    current: number,
    duration: number
}
export interface PlayerState {
    mode: PlayerMode,
    currentTime: number | null,
    duration: number | null

    queue: Array<PlexTrack>,
    queueId: string,
    queueIndex: number,
    currentTrack: PlexTrack | null
}

const initialState: PlayerState = {
    mode: 'stopped',
    currentTime: null,
    duration: null,
    queue: [],
    queueId: '',
    queueIndex: -1,
    currentTrack: null,
}

export const playerSlice = createSlice({
    name: 'player',
    initialState,
    reducers: {
        changePlayerMode: (state, action: PayloadAction<PlayerMode>) => {
            state.mode = action.payload;
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
        },
        previousTrack: (state) => {
            if (state.queueIndex > 0) {
                const newIndex = state.queueIndex - 1;
                
                state.queueIndex = newIndex;
                state.currentTrack = state.queue[newIndex];
            }
        },
        nextTrack: (state) => {
            if (state.queueIndex < state.queue.length) {
                const newIndex = state.queueIndex + 1;

                state.queueIndex = newIndex;
                state.currentTrack = state.queue[newIndex];
            }
        },
        clearPlayQueue: (state) => {
            state.queue = [];
            state.queueId = '';
            state.queueIndex = -1;
            state.currentTrack = null;
        }
    }
})

// Action creators are generated for each case reducer function
export const { changePlayerMode, setPlayerTime, previousTrack, nextTrack, buildPlayQueue, clearPlayQueue } = playerSlice.actions

export default playerSlice.reducer