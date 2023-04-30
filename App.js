import { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
// import {LogBox} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import {useRoute} from './router';

const fonts = {
  "Roboto-Regular": require("./assets/fonts/Roboto-Regular.ttf"),
  "Roboto-Medium": require("./assets/fonts/Roboto-Medium.ttf"),
  "Roboto-Bold": require("./assets/fonts/Roboto-Bold.ttf"),
  "Inter-Medium": require("./assets/fonts/Inter-Medium.ttf")
};


export default function App() {
  const [isReady, setIsReady] = useState(false);
  // LogBox.ignoreLogs(['Remote debugger']);
  

  const routing = useRoute(null)

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
    <NavigationContainer>
      {/* <View style={styles.container}> */}
        {routing}
        <StatusBar style="auto" />
      {/* </View> */}
    </NavigationContainer>      
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

