import userInfoReducer from "./userInfoReducer";
import { combineReducers} from "redux";

const allReducers = combineReducers({
    application: userInfoReducer
});

export default allReducers;