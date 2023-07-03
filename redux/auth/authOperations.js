import db, { auth } from "../../firebase/config";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile
} from 'firebase/auth';
import { authSlice } from "./authSlice";
import { uploadAvatarToServer } from "../../firebase/serverAPI";


export const authSignUpUser = ({ email, password, nickName, userPhoto }) => async (dispatch, getState) => {
    try {
        await createUserWithEmailAndPassword(auth, email, password);
        
        await updateProfile(auth.currentUser, {
            displayName: nickName,
            photoURL: userPhoto,
        });  
        const updateUserSuccess = auth.currentUser;

        dispatch(authSlice.actions.updateUserProfile({
            userId: updateUserSuccess.uid,
            nickName: updateUserSuccess.displayName,
            email: updateUserSuccess.email,
            userPhoto: updateUserSuccess.photoURL,
        }));
    } catch (error) {
        console.log('error authSignUpUser', error);
        console.log('error.message authSignUpUser', error.message);
        dispatch(authSlice.actions.setErrorSignIn({errorSignIn: error.message}));
    };
};

export const authSignInUser = ({ email, password }) => async (dispatch, getState) => {
    try {
        const user = await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        console.log('error', error);
        console.log('error.message', error.message);
        dispatch(authSlice.actions.setErrorLogin({errorLogin: error.message}));
    };
 };

export const authSignOutUser = () => async (dispatch, getState) => {
    try {
        await signOut(auth);
        console.log('Successfully SignOut!');
        dispatch(authSlice.actions.authSignOut());
    } catch (error) {
        console.log('error', error);
        console.log('error.message', error.message);
    };
 };

export const authStateChangeUser = () => async (dispatch, getState) => {
    try {
        auth.onAuthStateChanged((user) => {
            if (user) {
                const userUpdateProfile = {
                    userId: user.uid,
                    nickName: user.displayName,
                    email: user.email,
                    userPhoto: user.photoURL,
                };

                dispatch(authSlice.actions.authStateChange({ stateChange: true }));
                dispatch(authSlice.actions.updateUserProfile(userUpdateProfile));            
            }
        })
    } catch (error) {
        console.log(error.message);
    }
};
export const deleteAvatarFromStore = () => async (dispatch, getState) => {
    try {
        await updateProfile(auth.currentUser, {
            // photoURL: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png",
            photoURL: null,
        });
        const updateUserSuccess = auth.currentUser;

        dispatch(authSlice.actions.deleteOldAvatar({
            // userPhoto: updateUserSuccess.photoURL
            userPhoto: null,
        }))
    } catch (error) {
        console.log(error.message);
    }
}

export const setNewAvatar = (newAva) => async (dispatch, getState) => {
    try {
        const newAvatar = await uploadAvatarToServer(newAva);
        await updateProfile(auth.currentUser, {
            photoURL: newAvatar,
        });
        const updateUserSuccess = auth.currentUser;
        
        dispatch(authSlice.actions.updateUserAvatar({            
            userPhoto: updateUserSuccess.photoURL
        }));
    } catch (error) {
        console.log(error.message);
    };
};   
