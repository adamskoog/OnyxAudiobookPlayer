import { configureStore } from '@reduxjs/toolkit'
import { applicationReducer, serverReducer, libraryReducer, playerReducer } from './features'

import { useDispatch, useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'

export const store = configureStore({
  reducer: {
    application: applicationReducer,
    library: libraryReducer,
    server: serverReducer,
    player: playerReducer
  },
})

export type RootState = ReturnType<typeof store.getState>
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch

