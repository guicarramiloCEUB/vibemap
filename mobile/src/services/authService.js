// Exemplo de como usar a API do VibeMap no React Native

import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ============================================================================
// 1. AUTENTICAÇÃO - Register
// ============================================================================

export const registerUser = async (userData) => {
  try {
    const response = await api.post('users/register/', {
      username: userData.username,
      email: userData.email,
      password: userData.password,
    });
    
    console.log('✅ Usuário registrado:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Erro ao registrar:', error.response?.data || error.message);
    throw error;
  }
};

// ============================================================================
// 2. AUTENTICAÇÃO - Login
// ============================================================================

export const loginUser = async (email, password) => {  
  try {
    const response = await api.post('users/login/', {
      email,  // VibeMap User model usa email como USERNAME_FIELD
      password,
    });
    
    // Salvar tokens
    const { access, refresh } = response.data;
    await AsyncStorage.setItem('authToken', access);
    await AsyncStorage.setItem('refreshToken', refresh);
    
    // Adicionar token aos headers futuros
    api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
    
    console.log('✅ Login bem-sucedido');
    return response.data;
  } catch (error) {
    console.error('❌ Erro ao fazer login:', error.response?.data || error.message);
    throw error;
  }
};

// ============================================================================
// 3. AUTENTICAÇÃO - Refresh Token
// ============================================================================

export const refreshToken = async () => {
  try {
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    
    if (!refreshToken) {
      throw new Error('No refresh token found');
    }
    
    const response = await api.post('users/token/refresh/', {
      refresh: refreshToken,
    });
    
    const { access } = response.data;
    await AsyncStorage.setItem('authToken', access);
    api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
    
    console.log('✅ Token atualizado');
    return access;
  } catch (error) {
    console.error('❌ Erro ao atualizar token:', error.message);
    throw error;
  }
};

// ============================================================================
// 4. AUTENTICAÇÃO - Logout
// ============================================================================

export const logoutUser = async () => {
  try {
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('refreshToken');
    delete api.defaults.headers.common['Authorization'];
    
    console.log('✅ Logout bem-sucedido');
  } catch (error) {
    console.error('❌ Erro ao fazer logout:', error.message);
    throw error;
  }
};

// ============================================================================
// 5. AUTENTICAÇÃO - Get Current User
// ============================================================================

export const getCurrentUser = async () => {
  try {
    // Você precisará implementar um endpoint GET /api/users/me/
    // Por enquanto, retorna token info
    const token = await AsyncStorage.getItem('authToken');
    if (!token) {
      return null;
    }
    
    console.log('✅ Usuário autenticado');
    return token;
  } catch (error) {
    console.error('❌ Erro ao obter usuário:', error.message);
    return null;
  }
};

// ============================================================================
// EXEMPLOS DE USO NO COMPONENTE
// ============================================================================

/*

// Em um componente React Native:

import { useEffect, useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import { loginUser, registerUser, logoutUser } from './authService';

export default function AuthScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      await registerUser({ username, email, password });
      Alert.alert('Sucesso', 'Usuário registrado!');
    } catch (error) {
      Alert.alert('Erro', 'Falha ao registrar');
    }
  };

  const handleLogin = async () => {
    try {
      const result = await loginUser(username, password);
      Alert.alert('Sucesso', 'Login bem-sucedido!');
      // Navegar para tela principal
    } catch (error) {
      Alert.alert('Erro', 'Falha ao fazer login');
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      Alert.alert('Sucesso', 'Logout bem-sucedido!');
      // Navegar para tela de login
    } catch (error) {
      Alert.alert('Erro', 'Falha ao fazer logout');
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Register" onPress={handleRegister} />
      <Button title="Login" onPress={handleLogin} />
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}

*/

// ============================================================================
// TESTANDO A API VIA CONSOLE
// ============================================================================

/*

No browser developer tools (ou via Expo logs), você pode testar assim:

// Testar conexão
$ curl http://10.0.2.2:8000/admin/
# Se retornar HTML, está funcionando!

// Testar registro
$ curl -X POST http://10.0.2.2:8000/api/users/register/ \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@vibemap.com","password":"securepass123"}'

// Testar login
$ curl -X POST http://10.0.2.2:8000/api/users/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"securepass123"}'

*/
