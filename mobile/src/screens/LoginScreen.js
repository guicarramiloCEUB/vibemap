import React, { useState } from 'react';
import { Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { CommonActions } from '@react-navigation/native'; // serve para resetar a pilha de navegação, ou seja, quando o usuário fizer login, ele não vai conseguir voltar pra tela de login usando o botão de voltar do celular
import { AuthLayout, AuthInput, AuthButton } from '../components';
import AuthService from '../services/auth';
import { useStore } from '../stores';

export default function LoginScreen({ navigation }) { // navigation é uma prop que o react-navigation passa pra todas as telas, e serve para navegar entre as telas do app
  // usStates para armazenar o email, senha, e estado de loading do login
  const [email, setEmail] = useState(''); // inicializa email como string vazia, e setEmail como função para atualizar o email
  const [senha, setSenha] = useState(''); // inicializa senha como string vazia, e setSenha como função para atualizar a senha
  const [loading, setLoading] = useState(false); // inicializa loading como false, e setLoading como função para atualizar o estado de loading
  const { userStore } = useStore();

  const handleLogin = async () => { // async significa que essa função é assíncrona, ou seja, ela pode esperar por promessas (como a resposta do servidor) sem bloquear a interface do usuário
    
    // checa se email e senha estao preenchidos, se não, mostra um alerta e retorna
    if (!email || !senha) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }
    // seta loading como true, esta variável é usada para desabilitar os inputs e o botão de login enquanto a requisição está sendo feita, para evitar que o usuário tente fazer login várias vezes seguidas
    setLoading(true);
    try {
      // tenta fazer login
      const result = await AuthService.login(email, senha); // await espera a resposta
      

      if (result.success) {
        console.log('✅ Login bem-sucedido!');
        console.log('🔐 Access Token:', result.tokens.access);

        try {
          await userStore.fetchUserProfile();
        } catch (profileError) {
          console.warn('⚠️ Não foi possível carregar o perfil logo após o login:', profileError);
        }

        // limpa o historico de navigação garantindo que nao retorne para a tela de login
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'MainApp' }], // navega para a tela principal do app, que é a tela com as abas que foi definida no index.js da navegação
          })
        );
      } else {
        // se nao alerta que houve falha no login, mostrando a mensagem de erro retornada pelo servidor ou uma mensagem genérica
        console.warn('❌ Falha no login:', result.error);
        Alert.alert('Erro', `Falha no login: ${result.error || 'Email ou senha inválidos'}`);
      }
    } catch (error) {
      console.error('❌ Erro inesperado:', error);
      Alert.alert('Erro', 'Erro ao conectar com o servidor');
    } finally {
      setLoading(false); // depois de tudo libera o loading, independente se o login foi bem-sucedido ou não, para reabilitar os inputs e o botão de login
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