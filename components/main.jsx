import { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useRoute } from '../router';
import { useDispatch, useSelector } from 'react-redux';


const Main = () => {
    const { stateChange } = useSelector((state) => state.auth);
    const dispatch = useDispatch()
  

    const routing = useRoute(stateChange)

//   useEffect(() => {
//     async function preloadFonts() {
//       try {
//         await Font.loadAsync(fonts);
//         SplashScreen.hideAsync();
//       } catch (error) {
//         console.warn(error);
//       } finally {
//         setIsReady(true);
//         SplashScreen.hideAsync();
//       }
//     }
//     preloadFonts();
//   }, []);
  
//    if (!isReady) {
//     return null;
//   }  

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

export default Main;