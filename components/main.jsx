import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useRoute } from '../router';
import { useDispatch, useSelector } from 'react-redux';


const Main = () => {
    const { stateChange } = useSelector((state) => state.auth);
    const dispatch = useDispatch()
  

    const routing = useRoute(stateChange) 

  return (
    <NavigationContainer>
        {routing}
        <StatusBar style="auto" />
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