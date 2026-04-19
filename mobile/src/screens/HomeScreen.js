import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AuthService from '../services/auth';

export default function HomeScreen({ navigation }) {
  const handleLogout = async () => {
    await AuthService.logout();
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎉 Logged In!</Text>
      <Text style={styles.subtitle}>Bem-vindo ao VibeMap</Text>
      
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#fff' 
  },
  title: { 
    fontSize: 48, 
    fontWeight: 'bold', 
    marginBottom: 16,
    textAlign: 'center'
  },
  subtitle: { 
    fontSize: 18, 
    color: '#666',
    marginBottom: 48,
    textAlign: 'center'
  },
  button: { 
    backgroundColor: '#FF6B6B', 
    borderRadius: 8, 
    padding: 14, 
    paddingHorizontal: 32,
    alignItems: 'center' 
  },
  buttonText: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
});
