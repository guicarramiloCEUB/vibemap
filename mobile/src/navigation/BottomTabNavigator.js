import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import ExploreScreen from '../screens/ExploreScreen';
import BuyTicketsScreen from '../screens/BuyTicketsScreen';
import MapScreen from '../screens/MapScreen';
import TicketsScreen from '../screens/TicketsScreen';
import GroupsScreen from '../screens/GroupsScreen';

const Tab = createBottomTabNavigator();

// Componente de fundo gradient para a tab bar
function TabBarBackground() {
  return (
    <LinearGradient
      colors={['#7c3aed', '#5b21b6']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    />
  );
}

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Map"
      screenOptions={({ route }) => ({
        // Remove header das telas
        headerShown: false,
        // Styling do tab bar
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          borderTopWidth: 0,
          paddingBottom: 10,
          paddingTop: 10,
          height: 70,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          overflow: 'hidden',
        },
        
        // Fundo com gradiente
        tabBarBackground: TabBarBackground,
        
        // Ícones e labels
        tabBarIcon: ({ focused, color }) => {
          let icon;
          
          if (route.name === 'Explore') {
            icon = focused ? 'search' : 'search-outline';
          } else if (route.name === 'BuyTickets') {
            icon = focused ? 'ticket' : 'ticket-outline';
          } else if (route.name === 'Map') {
            icon = focused ? 'map' : 'map-outline';
          } else if (route.name === 'Tickets') {
            icon = focused ? 'document' : 'pricetags-outline';
          } else if (route.name === 'Groups') {
            icon = focused ? 'people' : 'people-outline';
          }
          
          return <Ionicons name={icon} size={24} color={color} />;
        },
        
        // Cores
        tabBarActiveTintColor: '#fff', // Branco quando ativo
        tabBarInactiveTintColor: '#e9d5ff', // Roxo claro quando inativo
        
        // Label styling
        tabBarLabel: ({ focused }) => {
          const labels = {
            Explore: 'Explore',
            BuyTickets: 'Buy tickets',
            Map: 'Home',
            Tickets: 'Tickets',
            Groups: 'Groups',
          };
          
          return (
            <Text 
              style={{
                fontSize: 11,
                color: focused ? '#fff' : '#e9d5ff',
                fontWeight: focused ? '600' : '400',
              }}
            >
              {labels[route.name]}
            </Text>
          );
        },
        sceneContainerStyle: {
          paddingBottom: 70,
        },
      })}
    >
      <Tab.Screen name="Explore" component={ExploreScreen} />
      <Tab.Screen name="BuyTickets" component={BuyTicketsScreen} />
      <Tab.Screen 
        name="Map" 
        component={MapScreen} 
        options={{
          tabBarLabel: 'VibeMap',
        }}
      />
      <Tab.Screen name="Tickets" component={TicketsScreen} />
      <Tab.Screen name="Groups" component={GroupsScreen} />
    </Tab.Navigator>
  );
}
