import React from "react";
import { createStackNavigator } from '@react-navigation/stack';
import DefaultProfileScreen from "./DefaultProfileScreen";
import CommentsScreen from "../nestedScreens/CommentsScreen";
import MapScreen from "../nestedScreens/MapScreen";

const NestedScreen = createStackNavigator();

const ProfileScreen = () => {
    
    return (
        <NestedScreen.Navigator initialRouteName="DefaultProfile">
            <NestedScreen.Screen
                name='DefaultProfile'
                component={DefaultProfileScreen}
                options={{ headerShown: false }}
            />
            <NestedScreen.Screen
                name='Comments'
                component={CommentsScreen}
                options={{
                    headerStyle: { height: 70 },
                    headerTitleAlign: 'center',
                    headerBackTitleStyle: { color: '#fff' },
                }}
            />
            <NestedScreen.Screen
                name='Map'
                component={MapScreen}
                options={{
                    headerStyle: { height: 70 },
                    headerTitleAlign: 'center',
                    headerBackTitleStyle: { color: '#fff' },
                }}
            />
        </NestedScreen.Navigator>
    );
};
 
export default ProfileScreen;