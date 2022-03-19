import { combineReducers, AnyAction } from 'redux';
import { configureStore } from '@reduxjs/toolkit'
import { ThunkAction } from 'redux-thunk';

import appStateReducer from "./appStateReducer";
import settingsReducer from "./settingsReducer";
import playQueueReducer from "./playQueueReducer";
import playerReducer from "./playerReducer";
import libraryReducer from "./libraryReducer";

// First we'll combine all the reducers into
// a single store.
const rootReducer = combineReducers({
    application: appStateReducer,
    settings: settingsReducer,
    playQueue: playQueueReducer,
    player: playerReducer,
    library: libraryReducer
});

// Declare the store, add dev tools and thunk middleware.
const store = configureStore({ reducer: rootReducer });


// Declare global types related to the store.
declare global {
    type RootState = ReturnType<typeof store.getState>;
    type AppDispatch = typeof store.dispatch;
    type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, AppAction>;
    type AppAction = AnyAction;
}

export default store;