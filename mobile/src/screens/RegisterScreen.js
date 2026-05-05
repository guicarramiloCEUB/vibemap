import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import AuthLayout from '../components/AuthLayout';
import AuthInput from '../components/AuthInput';
import AuthButton from '../components/AuthButton';
import AuthService from '../services/auth';

export default function RegisterScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!nome || !email || !senha) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }
    
    setLoading(true);
    try {
      const result = await AuthService.register(email, nome, senha);
      
      if (result.success) {
        console.log('✅ Registro bem-sucedido!');
        console.log('🔐 Access Token:', result.tokens.access.substring(0, 20) + '...');
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'MainApp' }],
          })
        );
      } else {
        Alert.alert('Erro', `Não foi possível criar a conta: ${result.error}`);
      }
    } catch (error) {
      console.error('❌ Erro inesperado:', error);
      Alert.alert('Erro', 'Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout logo>
      <Text style={styles.title}>Criar Conta</Text>
      
      <AuthInput
        placeholder="Nome de usuário"
        value={nome}
        onChangeText={setNome}
        icon="person"
        editable={!loading}
      />
      
      <AuthInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        icon="mail"
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!loading}
      />
      
      <AuthInput
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        icon="lock-closed"
        secureTextEntry
        editable={!loading}
      />
      
      <AuthButton 
        title="Cadastrar" 
        onPress={handleRegister} 
        loading={loading}
      />
      
      <TouchableOpacity onPress={() => navigation.navigate('Login')} disabled={loading}>
        <Text style={styles.link}>Já tem conta? Entrar</Text>
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
  link: {
    textAlign: 'center',
    color: '#0066FF',
    fontSize: 14,
    marginTop: 16,
    textDecorationLine: 'underline',
  },
});