import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { Provider } from "react-native-paper";

import { theme } from "./app/core/theme";
import {
  HomeScreen,
  LoginScreen,
  ResetPasswordScreen
} from "./app/screens";
import { AuthProvider } from "./context/AuthContext";

const Stack = createStackNavigator();

export default function App() {
  return (
    <Provider theme={theme}>
      <NavigationContainer>
        <AuthProvider>
          <Stack.Navigator
            initialRouteName="LoginScreen"
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
            <Stack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen} />
            {/* <Stack.Screen
              name="ResetPasswordScreen"
              component={ResetPasswordScreen}
            /> */}
          </Stack.Navigator>
        </AuthProvider>
      </NavigationContainer>
    </Provider>
  );
}
