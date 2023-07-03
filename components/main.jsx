import { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useRoute } from '../router';
import { useDispatch, useSelector } from 'react-redux';
import { authStateChangeUser } from '../redux/auth/authOperations';
import ToastManager from 'toastify-react-native';


const Main = () => {
  const { stateChange } = useSelector((state) => state.auth);
  const state = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(authStateChangeUser());
  }, []);

  const routing = useRoute(stateChange);

  return (
    <NavigationContainer >
      {routing}
      <StatusBar style="auto" />
      <ToastManager style={{ flex: 1, marginTop: StatusBar.currentHeight }} theme='light' animationStyle='zoomInOut' height={80} />
    </NavigationContainer>
  );
};

export default Main;