import appStateReducer from "./appStateReducer";
import settingsReducer from "./settingsReducer";
import playQueueReducer from "./playQueueReducer";
import playerReducer from "./playerReducer";
import libraryReducer from "./libraryReducer";

import { combineReducers} from "redux";

const allReducers = combineReducers({
    application: appStateReducer,
    settings: settingsReducer,
    playQueue: playQueueReducer,
    player: playerReducer,
    library: libraryReducer
});

export default allReducers;