import { combineReducers } from "redux";
import listReducer from "./features/listSlice";


const rootReducer = combineReducers({
  list: listReducer,

});

export default rootReducer;