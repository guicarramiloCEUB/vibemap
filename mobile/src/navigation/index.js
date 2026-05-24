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
    <NavigationContainer> {/*container que gerencia a navegação do app, necessário para usar o react-navigation*/}
      {/* aqui definimos as telas do app, a ordem delas, e algumas opções de navegação (como esconder o header)*/}
      {/* quando você vai de uma tela pra outra, a primeira tela fica "embaixo" na pilha. Se você voltar, ela aparece de novo*/}
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        {/* initialRouteName define a tela inicial do app, que nesse caso é a tela de login */}
        <Stack.Screen name="Login" component={LoginScreen} />
        {/* name define o nome da tela, que é usado para navegar entre as telas (ex: navigation.navigate('Register') leva pra tela de registro) */}
        {/* component define qual componente é renderizado quando essa tela é ativa */}
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="MainApp" component={BottomTabNavigator} /> // aqui carrega as abas do app
      </Stack.Navigator>
    </NavigationContainer>
  );
}