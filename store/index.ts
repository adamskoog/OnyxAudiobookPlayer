import { configureStore } from '@reduxjs/toolkit'
import { applicationReducer, serverReducer, libraryReducer, playerReducer } from './features'

import { useAppDispatch, useAppSelector, useAppStore } from './hooks'

const makeStore = () => {
  return configureStore({
    reducer: {
      application: applicationReducer,
      library: libraryReducer,
      server: serverReducer,
      player: playerReducer
    },
  })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']

export { makeStore, useAppDispatch, useAppSelector, useAppStore }
