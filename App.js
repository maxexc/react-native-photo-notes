import { useEffect, useState } from 'react';
// import {LogBox} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { RegistrationScreen } from './screens/RegistrationScreen';
import { LoginScreen } from './screens/LoginScreen';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

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
    <View style={styles.container}>
      <RegistrationScreen />
      {/* <LoginScreen />      */}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

