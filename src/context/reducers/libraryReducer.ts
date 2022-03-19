import * as actionTypes from '../actions/actionTypes';
import { SORT_ORDER, MUSIC_LIBRARY_DISPAY_TYPE } from '../../plex/Api';

declare global {

    type LibraryState = {
        isLoading: boolean,
        items: Array<any>,
        displayType: string,
        sortType: string,
    }
}

const defaultState: LibraryState = {
  isLoading: false,
  items: [],
  displayType: MUSIC_LIBRARY_DISPAY_TYPE.album.title,
  sortType: SORT_ORDER.ascending,
};

const libraryReducer = (state: LibraryState = defaultState, action: AppAction): LibraryState => {
  switch (action.type) {
    case actionTypes.SET_LIBRARY_LOADING:
      return { ...state, isLoading: true };
    case actionTypes.SET_LIBRARY_DISPLAY_TYPE:
      return { ...state, displayType: action.payload };
    case actionTypes.SET_LIBRARY_SORT_TYPE:
      return { ...state, sortType: action.payload };
    case actionTypes.SET_LIBRARY_ITEMS:
      return { ...state, isLoading: false, items: action.payload };
    default:
      return state;
  }
};
export default libraryReducer;
