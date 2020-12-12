import appStateReducer from "./appStateReducer";
import settingsReducer from "./settingsReducer";
import playQueueReducer from "./playQueueReducer";

import { combineReducers} from "redux";

const allReducers = combineReducers({
    application: appStateReducer,
    settings: settingsReducer,
    playQueue: playQueueReducer
});

export default allReducers;