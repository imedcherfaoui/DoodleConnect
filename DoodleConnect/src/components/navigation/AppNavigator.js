import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "../../pages/private/Home/Home";
import Login from "../../pages/Login/Login";
import { useAuth } from "../../../firebase/authContext";
import SignUp from "../../pages/SignUp/SignUp";

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { userLoggedIn } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={!userLoggedIn ? Login : Home}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="SignUp" component={!userLoggedIn ? SignUp : Home} />
        <Stack.Screen
          name="Home"
          component={userLoggedIn ? Home : Login}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
