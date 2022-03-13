import * as actionTypes from "./actionTypes";
import { getLibraryItems, createLibrarySortQuery } from '../../plex/Api';

export const setLibrarySortOrder = (order) => {
    return {
        type: actionTypes.SET_LIBRARY_SORT_TYPE,
        payload: order
    };
}

export const setLibraryDisplayType = (type) => {
    return {
        type: actionTypes.SET_LIBRARY_DISPLAY_TYPE,
        payload: type
    };
}

export const fetchLibraryItems = () => {
    return async (dispatch, getState) => {

        dispatch({ type: actionTypes.SET_LIBRARY_LOADING });

        const state = getState();
        const userInfo = state.application.user
        const baseUrl = state.application.baseUrl;
        const section = state.settings.librarySection;
        const resource = state.settings.currentServer;
        
        const displayType = state.library.displayType;
        const sortType = state.library.sortType;

        if (userInfo || baseUrl || section) {
            const data = await getLibraryItems(baseUrl, section, { "X-Plex-Token": resource.accessToken }, createLibrarySortQuery({ display: displayType, order: sortType }));
            if (data.MediaContainer.Metadata)
                dispatch({ type: actionTypes.SET_LIBRARY_ITEMS, payload: data.MediaContainer.Metadata });
            else
                dispatch({ type: actionTypes.SET_LIBRARY_ITEMS, payload: [] });
        } else
            dispatch({ type: actionTypes.SET_LIBRARY_ITEMS, payload: [] });
    };
}