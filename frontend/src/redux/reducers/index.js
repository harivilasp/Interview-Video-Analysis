import { combineReducers } from "redux";

import mainReducer from "./mainReducer";
import notifierReducer from "./notifierReducer";

const reducers = combineReducers(
    {
        mainReducer: mainReducer,
        notifierReducer: notifierReducer,
    }
);

export default reducers;