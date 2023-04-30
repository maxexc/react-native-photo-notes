import React, { useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { RegistrationScreen } from './screens/auth/RegistrationScreen';
import { LoginScreen } from './screens/auth/LoginScreen';
import PostsScreen from './screens/main/PostsScreen';
import CreateScreen from './screens/main/CreatePostScreen';
import ProfileScreen from './screens/main/ProfileScreen';

// icons
import { SimpleLineIcons } from '@expo/vector-icons'; 
import { Feather } from '@expo/vector-icons'; 
import { AntDesign } from '@expo/vector-icons';
import { StyleSheet, View } from "react-native";



const AuthStack = createStackNavigator();
const MainTab = createBottomTabNavigator();

export const useRoute = (isAuth) => {

    if (!isAuth) {
        return (
            <AuthStack.Navigator>
                <AuthStack.Screen
                    options={{
                        headerShown: false,
                    }}
                    name='Registration'
                    component={RegistrationScreen}
                />
                <AuthStack.Screen
                    options={{
                        headerShown: false,
                    }}
                    name='Login'
                    component={LoginScreen}
                />
            </AuthStack.Navigator>)
    }
    return (
        <>
            <MainTab.Navigator
                style={{tabBarStyle: 'none'}}
                initialRouteName="Create"
                screenOptions={{
                    headerShown: false,
                    tabBarShowLabel: false,
                    tabBarActiveTintColor: '#FFFFFF',
                    tabBarInactiveTintColor: '#212121CC',
                    tabBarActiveBackgroundColor: "#FF6C00",
                    tabBarItemStyle: { borderRadius: 20, height: 40 },
                    tabBarStyle: {
                        paddingTop: 9,
                        height: 83,
                        width: 272,
                        alignSelf: 'center',
                        shadowColor: '#fff',
                        },
                }}
            >
            <MainTab.Screen
                name='Posts'
                component={PostsScreen}
                options={{
                    tabBarIcon: ({ focused, size, color }) => (
                        <SimpleLineIcons name="grid" size={size} color={color} />                       
                    ),
                }}                
            />
            <MainTab.Screen
                name='Create'
                component={CreateScreen}
                options={{
                    tabBarIcon: ({ focused, size, color }) => (
                        <AntDesign name="plus" size={24} color={color} />
                    ),
                }}                
            />
            <MainTab.Screen
                name='Profile'
                component={ProfileScreen}
                options={{
                    tabBarIcon: ({ focused, size, color }) => (
                        <Feather name="user" size={24} color={color} />  
                    ),
                }}                
            />
        </MainTab.Navigator>
        <View style={styles.homeIndicator} /> 
        </>)
};

const styles = StyleSheet.create({
    homeIndicator: {
        position: 'absolute',
        height: 5,
        width: 134,
        alignSelf: 'center',
        bottom: 6,
        backgroundColor: '#212121',
        borderRadius: 100,
    },
})