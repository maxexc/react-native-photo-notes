import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { authReducer, authSlice } from "./auth/authSlice";

const rootReduce = combineReducers({
    [authSlice.name ]: authSlice.reducer,
})

export const store = configureStore({
    reducer: rootReduce,
})