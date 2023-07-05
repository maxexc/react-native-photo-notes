import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { authSlice } from "./auth/authSlice";

// const rootReduce = combineReducers({
//     [authSlice.name]: authSlice.reducer,
// });

export const store = configureStore({
    // reducer: rootReduce,
    reducer: {
        [authSlice.name]: authSlice.reducer,
    }
});