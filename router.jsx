import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { RegistrationScreen } from './screens/auth/RegistrationScreen';
import { LoginScreen } from './screens/auth/LoginScreen';
import PostsScreen from './screens/main/PostsScreen';
import CreateScreen from './screens/main/CreatePostScreen';
import ProfileScreen from "./screens/main/ProfileScreen";
import { AntDesign, Feather, SimpleLineIcons } from '@expo/vector-icons';
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

const AuthStack = createStackNavigator();
const MainTab = createBottomTabNavigator();

const getTabBarStyle = (route) => {
  const routeName = getFocusedRouteNameFromRoute(route) ?? "";
  if (routeName === "Comments" || routeName === "Map") {
    return { display: "none" };
  }
  return {
    height: 64,
    paddingTop: 9,
    paddingHorizontal: 20,
  };
};

export const useRoute = (isAuth) => {
  if (!isAuth) {
    return (
      <AuthStack.Navigator>
        <AuthStack.Screen
          options={{ headerShown: false }}
          name='Registration'
          component={RegistrationScreen}
        />
        <AuthStack.Screen
          options={{ headerShown: false }}
          name='Login'
          component={LoginScreen}
        />
      </AuthStack.Navigator>
    );
  }

  return (
    <MainTab.Navigator
      initialRouteName="Posts"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#212121CC',
        tabBarActiveBackgroundColor: "#FF6C00",
        tabBarItemStyle: { borderRadius: 20, height: 40, marginHorizontal: 10 },
        tabBarStyle: getTabBarStyle(route),
      })}
    >
      <MainTab.Screen
        name='Posts'
        component={PostsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <SimpleLineIcons name="grid" size={size} color={color} />
          ),
        }}
      />
      <MainTab.Screen
        name='Create'
        component={CreateScreen}
        options={{
          unmountOnBlur: true,
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="plus" size={24} color={color} />
          ),
        }}
      />
      <MainTab.Screen
        name='Profile'
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="user" size={24} color={color} />
          ),
        }}
      />
    </MainTab.Navigator>
  );
};
