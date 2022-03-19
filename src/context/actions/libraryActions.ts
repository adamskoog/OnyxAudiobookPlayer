import * as actionTypes from './actionTypes';
import { getLibraryItems, createLibrarySortQuery } from '../../plex/Api';

export const setLibrarySortOrder = (order: any): AppAction => ({
  type: actionTypes.SET_LIBRARY_SORT_TYPE,
  payload: order,
});

export const setLibraryDisplayType = (type: any): AppAction => ({
  type: actionTypes.SET_LIBRARY_DISPLAY_TYPE,
  payload: type,
});

export const fetchLibraryItems = (): AppThunk => async (dispatch, getState) => {
  dispatch({ type: actionTypes.SET_LIBRARY_LOADING });
  dispatch({ type: actionTypes.SET_LIBRARY_ITEMS, payload: [] });

  const state = getState();
  const { baseUrl } = state.application;
  const section = state.settings.librarySection;
  const resource = state.settings.currentServer;

  const { displayType } = state.library;
  const { sortType } = state.library;

  if (baseUrl && section && resource) {
    const data = await getLibraryItems(baseUrl, section, { 'X-Plex-Token': resource.accessToken }, createLibrarySortQuery({ display: displayType, order: sortType }));
    if (data.MediaContainer.Metadata) dispatch({ type: actionTypes.SET_LIBRARY_ITEMS, payload: data.MediaContainer.Metadata });
  }
};
