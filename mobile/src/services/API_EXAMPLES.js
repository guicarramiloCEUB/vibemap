// ============================================================================
// TESTES E EXEMPLOS - Como usar a API do VibeMap
// ============================================================================

/**
 * ✅ API Status: TESTADA E FUNCIONANDO
 * 
 * Endpoints Comprovados:
 * - POST /api/users/register/  → Criar novo usuário
 * - POST /api/users/login/     → Obter tokens JWT
 * - POST /api/users/token/refresh/ → Renovar access token
 */

// ============================================================================
// 1. TESTE DE REGISTRO
// ============================================================================

/*
Comando:
$ curl -X POST http://127.0.0.1:8000/api/users/register/ \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@vibemap.com","password":"securepass123"}'

Resposta esperada:
{
  "email": "test@vibemap.com",
  "username": "testuser"
}
*/

// ============================================================================
// 2. TESTE DE LOGIN
// ============================================================================

/*
Comando:
$ curl -X POST http://127.0.0.1:8000/api/users/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"test@vibemap.com","password":"securepass123"}'

Resposta esperada:
{
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDg1MTI4NCwiaWF0IjoxNzc0NzY0ODg0LCJqdGkiOiIwYTRlNGQ2MzgxYWU0ZTZjYjJlZWNlYWYxNjM4NDY5YSIsInVzZXJfaWQiOiIyIn0.LOPhATkRLoV0mJn4kOJ6GPCLaxb6cGG2XVRjDZrYDa8",
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzc0NzY1MTg0LCJpYXQiOjE3NzQ3NjQ4ODQsImp0aSI6ImEwNjRkMzIyZWY5OTQyNzc5M2I4Y2Q5YmU1ODYyYTNmIiwidXNlcl9pZCI6IjIifQ.LYBzujZVC1pBsRdmI_62cyJnbgwNcElbF11Q"
}

IMPORTANTE: O User model do VibeMap usa EMAIL como USERNAME_FIELD (não username!)
*/

// ============================================================================
// 3. IMPLEMENTAÇÃO NO COMPONENTE DE LOGIN
// ============================================================================

/*
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert } from 'react-native';
import { loginUser } from '../services/authService';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    setLoading(true);
    try {
      // Esta função salva os tokens em AsyncStorage automaticamente
      await loginUser(email, password);
      Alert.alert('Sucesso', 'Login realizado!');
      navigation.replace('Home');
    } catch (error) {
      Alert.alert('Erro', 'Email ou senha incorretos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        editable={!loading}
      />
      <TextInput
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!loading}
      />
      <TouchableOpacity 
        onPress={handleLogin}
        disabled={loading}
      >
        <Text>{loading ? 'Carregando...' : 'Entrar'}</Text>
      </TouchableOpacity>
    </View>
  );
}
*/

// ============================================================================
// 4. IMPLEMENTAÇÃO NO COMPONENTE DE REGISTRO
// ============================================================================

/*
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert } from 'react-native';
import { registerUser, loginUser } from '../services/authService';

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!username || !email || !password) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    setLoading(true);
    try {
      // Registrar usuário
      await registerUser({ username, email, password });
      
      // Fazer login automaticamente
      await loginUser(email, password);
      
      Alert.alert('Sucesso', 'Conta criada e autenticada!');
      navigation.replace('Home');
    } catch (error) {
      const errorMessage = error.response?.data?.email?.[0] 
        || error.response?.data?.username?.[0]
        || 'Erro ao registrar';
      Alert.alert('Erro', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Nome de usuário"
        value={username}
        onChangeText={setUsername}
        editable={!loading}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        editable={!loading}
      />
      <TextInput
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!loading}
      />
      <TouchableOpacity 
        onPress={handleRegister}
        disabled={loading}
      >
        <Text>{loading ? 'Carregando...' : 'Criar Conta'}</Text>
      </TouchableOpacity>
    </View>
  );
}
*/

// ============================================================================
// 5. PRÓXIMAS ETAPAS
// ============================================================================

/*
1. ✅ API funcionando
2. ✅ Autenticação testada
3. TODO: Implementar telas de Login/Register
4. TODO: Persistir tokens com AsyncStorage
5. TODO: Adicionar refresh de token automático
6. TODO: Proteger rotas que necessitam autenticação
7. TODO: Criar Event models e endpoints
8. TODO: Implementar WebSocket para atualizações em tempo real
*/
