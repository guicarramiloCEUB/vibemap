import React, { useState } from 'react';
import { Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { AuthLayout, AuthInput, AuthButton } from '../components';
import AuthService from '../services/auth';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }
    
    setLoading(true);
    try {
      const result = await AuthService.login(email, senha);
      
      if (result.success) {
        console.log('✅ Login bem-sucedido!');
        console.log('🔐 Access Token:', result.tokens.access.substring(0, 20) + '...');
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'MainApp' }],
          })
        );
      } else {
        Alert.alert('Erro', `Falha no login: ${result.error || 'Email ou senha inválidos'}`);
      }
    } catch (error) {
      console.error('❌ Erro inesperado:', error);
      Alert.alert('Erro', 'Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Text style={styles.title}>Sign In</Text>

      <AuthInput
        icon="mail"
        placeholder="Username or email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        editable={!loading}
      />

      <AuthInput
        icon="lock-closed"
        placeholder="Password"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        editable={!loading}
      />

      <TouchableOpacity onPress={() => {} /* TODO: Forgot password */} disabled={loading}>
        <Text style={styles.forgotLink}>Forgot password?</Text>
      </TouchableOpacity>

      <AuthButton
        title="Sign in"
        onPress={handleLogin}
        loading={loading}
        disabled={loading}
      />

      <TouchableOpacity onPress={() => navigation.navigate('Register')} disabled={loading}>
        <Text style={styles.registerLink}>Não tem conta? <Text style={styles.registerLinkBold}>Cadastre-se</Text></Text>
      </TouchableOpacity>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 32,
    textAlign: 'center',
    color: '#000',
  },
  forgotLink: {
    textAlign: 'right',
    color: '#999',
    fontSize: 13,
    marginBottom: 16,
  },
  registerLink: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    marginTop: 16,
  },
  registerLinkBold: {
    fontWeight: '600',
    color: '#0066FF',
  },
});