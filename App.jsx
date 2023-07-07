import { useEffect, useState } from 'react';
// import {LogBox} from 'react-native';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Provider } from 'react-redux';
import Main from './components/main';
import { store } from './redux/store';

const fonts = {
  "Roboto-Regular": require("./assets/fonts/Roboto-Regular.ttf"),
  "Roboto-Medium": require("./assets/fonts/Roboto-Medium.ttf"),
  "Roboto-Bold": require("./assets/fonts/Roboto-Bold.ttf"),
  "Inter-Medium": require("./assets/fonts/Inter-Medium.ttf")
};


export default function App() {
  const [isReady, setIsReady] = useState(false);
  // LogBox.ignoreLogs(['Remote debugger']);  
  

  useEffect(() => {
    async function preloadFonts() {
      try {
        await Font.loadAsync(fonts);
        SplashScreen.hideAsync();
      } catch (error) {
        console.warn(error);
      } finally {
        setIsReady(true);
        SplashScreen.hideAsync();
      }
    }
    preloadFonts();
  }, []);
  
   if (!isReady) {
    return null;
  }  

  return (
    <Provider store={store}>
      <Main />      
    </Provider> 
  );
}
