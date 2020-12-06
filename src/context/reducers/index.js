import appStateReducer from "./appStateReducer";
import { combineReducers} from "redux";

const allReducers = combineReducers({
    application: appStateReducer
});

export default allReducers;