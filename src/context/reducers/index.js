import userInfoReducer from "./userInfoReducer";
import { combineReducers} from "redux";

const allReducers = combineReducers({
    userInfo: userInfoReducer
});

export default allReducers;