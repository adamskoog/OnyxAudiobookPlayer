import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { MUSIC_LIBRARY_DISPAY_TYPE, SORT_ORDER } from '@/utility/plex'
import * as SettingsUtils from '@/utility/settings'

export interface LibraryState {
    isLoading: boolean,
    libraryId: string | null,
    displayType: string,
    sortType: string,
}

const initialState: LibraryState = {
    isLoading: false,
    libraryId: null,
    displayType: MUSIC_LIBRARY_DISPAY_TYPE.album.title,
    sortType: SORT_ORDER.ascending,
}

export const librarySlice = createSlice({
  name: 'library',
  initialState,
  reducers: {
      setActiveLibrary: (state, action: PayloadAction<string>) => {
          state.libraryId = action.payload
          SettingsUtils.saveSettingToStorage(SettingsUtils.SETTINGS_KEYS.libraryId, action.payload)
      },
      clearActiveLibrary: (state) => {
          state.libraryId = null
          SettingsUtils.removeSettingFromStorage(SettingsUtils.SETTINGS_KEYS.libraryId)
      },
      setSortOrder: (state, action: PayloadAction<string>) => {
            state.sortType = action.payload;
      },
      setDisplayType: (state, action: PayloadAction<string>) => {
            state.displayType = action.payload;
      },
  }
})

// Action creators are generated for each case reducer function
const { setActiveLibrary, clearActiveLibrary, setSortOrder, setDisplayType } = librarySlice.actions

export { setActiveLibrary, clearActiveLibrary, setSortOrder, setDisplayType }

export default librarySlice.reducer