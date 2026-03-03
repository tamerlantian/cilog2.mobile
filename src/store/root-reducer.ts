import { combineReducers } from "@reduxjs/toolkit";
import settingsReducer from "../modules/settings/store/slice/settings.slice";

const rootReducer = combineReducers({
  settings: settingsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
