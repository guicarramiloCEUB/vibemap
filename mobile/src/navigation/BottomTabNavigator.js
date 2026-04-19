import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import ExploreScreen from '../screens/ExploreScreen';
import BuyTicketsScreen from '../screens/BuyTicketsScreen';
import MapScreen from '../screens/MapScreen';
import TicketsScreen from '../screens/TicketsScreen';
import GroupsScreen from '../screens/GroupsScreen';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // Remove header das telas
        headerShown: false,
        
        // Styling do tab bar
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#eee',
          paddingBottom: 10,
          paddingTop: 10,
          height: 70,
        },
        
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
            icon = focused ? 'document' : 'document-outline';
          } else if (route.name === 'Groups') {
            icon = focused ? 'people' : 'people-outline';
          }
          
          return <Ionicons name={icon} size={24} color={color} />;
        },
        
        // Cores
        tabBarActiveTintColor: '#7c3aed', // Roxo
        tabBarInactiveTintColor: '#999',
        
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
                color: focused ? '#7c3aed' : '#999',
                fontWeight: focused ? '600' : '400',
              }}
            >
              {labels[route.name]}
            </Text>
          );
        },
      })}
    >
      <Tab.Screen name="Explore" component={ExploreScreen} />
      <Tab.Screen name="BuyTickets" component={BuyTicketsScreen} />
      <Tab.Screen 
        name="Map" 
        component={MapScreen}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen name="Tickets" component={TicketsScreen} />
      <Tab.Screen name="Groups" component={GroupsScreen} />
    </Tab.Navigator>
  );
}

// Importa Text que faltou
import { Text } from 'react-native';
