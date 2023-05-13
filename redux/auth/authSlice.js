import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        userId: null,
        nickname: null,
        stateChange: false,
    },
    reducers: {
        authStateChange: (state) => ({
        ...state,
        stateChange: true,
        }),
    },
})

export const onStateChange = authSlice.actions.authStateChange;