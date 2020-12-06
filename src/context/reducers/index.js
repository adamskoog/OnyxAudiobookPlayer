import appStateReducer from "./appStateReducer";
import settingsReducer from "./settingsReducer";
import { combineReducers} from "redux";

const allReducers = combineReducers({
    application: appStateReducer,
    settings: settingsReducer
});

export default allReducers;