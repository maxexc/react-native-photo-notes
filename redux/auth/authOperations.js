import { createSlice } from '@reduxjs/toolkit';
import Toast from 'react-native-toast-message';
import { authSignUpUser, authSignInUser, authSingOutUser } from './operations';

const initialState = {
  userId: null,
  nickname: null,
  stateChange: false,
  email: null,
  avatar: null,
};
