import React from "react";
import { createStackNavigator } from '@react-navigation/stack';
import DefaultScreenPosts from "../nestedScreens/DefaultScreenPosts";
import CommentsScreen from "../nestedScreens/CommentsScreen";
import MapScreen from "../nestedScreens/MapScreen";

const NestedScreen = createStackNavigator();

const PostScreen = () => {
    
    return (
        <NestedScreen.Navigator >
            <NestedScreen.Screen name='DefaultScreen'
                component={DefaultScreenPosts}
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
 
export default PostScreen;