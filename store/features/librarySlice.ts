import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

import type { RootState, AppDispatch } from '@/store'

import PlexJavascriptApi, { MUSIC_LIBRARY_DISPAY_TYPE, SORT_ORDER } from '@/plex'
import type { PlexAlbumMetadata, PlexArtistListMetadata, PlexCollectionMetadata } from '@/types/plex.types'
import * as SettingsUtils from '@/utility/settings'

export interface LibraryState {
    isLoading: boolean,
    libraryId: string | null,
    items: Array<PlexAlbumMetadata | PlexArtistListMetadata | PlexCollectionMetadata>,
    displayType: string,
    sortType: string,
}

const initialState: LibraryState = {
    isLoading: false,
    libraryId: null,
    items: [],
    displayType: MUSIC_LIBRARY_DISPAY_TYPE.album.title,
    sortType: SORT_ORDER.ascending,
}

interface ThunkApi {
  dispatch: AppDispatch,
  state: RootState
}

interface LibraryReturn {
    items: Array<PlexAlbumMetadata | PlexArtistListMetadata | PlexCollectionMetadata>
}

const getLibraryItems = createAsyncThunk<LibraryReturn, void, ThunkApi>('library/getLibraryItems', async (_, { getState, dispatch}) => {

    const state: RootState = getState();

    if (state.library.libraryId) {
        const sortArgs = PlexJavascriptApi.createLibrarySortQuery({ display: state.library.displayType, order: state.library.sortType });
        const items = await PlexJavascriptApi.getLibraryItems(state.library.libraryId, sortArgs);

        return {
            items
        }
    }

    return {
        items: []
    }
})

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
  },
  extraReducers: (builder) => {
    builder
        .addCase(getLibraryItems.pending, (state) => {
            state.items = []
            state.isLoading = true
        })
        .addCase(getLibraryItems.fulfilled, (state, { payload }) => {
            state.items = payload.items
            state.isLoading = false
        })
        .addCase(getLibraryItems.rejected, (state) => {
            state.items = []
            state.isLoading = false
        })
  }
})

// Action creators are generated for each case reducer function
const { setActiveLibrary, clearActiveLibrary, setSortOrder, setDisplayType } = librarySlice.actions

export { setActiveLibrary, clearActiveLibrary, setSortOrder, setDisplayType, getLibraryItems }

export default librarySlice.reducer