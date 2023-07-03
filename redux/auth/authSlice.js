import { createSlice } from "@reduxjs/toolkit";

const state = {
    userId: null,
    nickName: null,
    userPhoto: null,
    email: null,
    stateChange: false,
    errorSignIn: null,
    errorLogin: null,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState: state,
    reducers: {
        updateUserProfile: (state, { payload }) => ({
            ...state,
            userId: payload.userId,
            nickName: payload.nickName,
            email: payload.email,
            userPhoto: payload.userPhoto,
            errorSignIn: null,
            errorLogin: null,
        }),
        authStateChange: (state, { payload }) => ({
            ...state,
            stateChange: payload.stateChange,
            errorSignIn: null,
            errorLogin: null,
        }),
        authSignOut: () => state,

        updateUserAvatar: (state, { payload }) => ({
            ...state,
            userPhoto: payload.userPhoto,
        }),
        deleteOldAvatar: (state, { payload }) => ({
            ...state,
            userPhoto: payload.userPhoto,
        }),
        setErrorSignIn: (state, { payload }) => ({
            ...state,
            errorSignIn: payload.errorSignIn,
        }),
        setErrorLogin: (state, { payload }) => ({
            ...state,
            errorLogin: payload.errorLogin,
        }),
    },
});
