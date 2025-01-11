import { configureStore } from "@reduxjs/toolkit";
import spreadSheetReducer from "./slices/spreadSheetSlice";

export const store = configureStore({
reducer  : {
    spreadSheet : spreadSheetReducer,
}
});