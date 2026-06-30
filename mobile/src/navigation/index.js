import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import BottomTabNavigator from './BottomTabNavigator';

// aqui funciona meio que como o maestro da navegação do app, definindo as telas e a ordem delas

const Stack = createStackNavigator(); // inicializa a pilha de navegação, que é o tipo de navegação mais comum (uma tela "empilha" a outra, e você pode voltar pra tela anterior)

export default function Navigation() {
  return (
    <NavigationContainer> 
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="MainApp" component={BottomTabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}