import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
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
import ProfileScreen from "./app/screens/ProfileScreen";
import ServicesScreen from './app/screens/ServicesScreen';
import { AuthProvider } from "./context/AuthContext";
import { auth } from "./service/firebase";
import ServiceDetailsScreen from "./app/screens/ServiceDetailsScreen";
import BusinessScreen from "./app/screens/BusinessScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const handleLogout = async (navigation) => {
  try {
    await auth.signOut();
    navigation.reset({
      index: 0,
      routes: [{ name: "LoginScreen" }],
    });
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
  }
};

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "blue", // Mudar a cor do ícone ativo
      }}
    >
      <Tab.Screen
        name="Início"
        component={HomeScreen}
        options={({ navigation }) => ({

          headerRight: () => (
            <Ionicons
              name="log-out"
              size={24}
              color="red"
              style={{ marginRight: 15 }}
              onPress={() => handleLogout(navigation)}
            />
          ),
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={24} color={color} />
          ),
        })}
      />
      <Tab.Screen
        name="Empresas"
        component={BusinessScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="business" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={ProfileScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Ionicons name="person" size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

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
            <Stack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen} />
            <Stack.Screen name="HomeTabs" component={HomeTabs} />
            <Stack.Screen name="ServiceDetails" component={ServiceDetailsScreen} />
            <Stack.Screen name="Services" component={ServicesScreen} />
          </Stack.Navigator>
        </AuthProvider>
      </NavigationContainer>
    </Provider>
  );
}