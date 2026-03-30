import React, { useState, useEffect } from 'react';
import { View, Text, Button, ScrollView, StyleSheet, Alert } from 'react-native';
import api from '../services/api';

const APITestScreen = () => {
  const [logs, setLogs] = useState(['🚀 Iniciando testes...']);

  const addLog = (message) => {
    console.log(message);
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  useEffect(() => {
    addLog('📱 Tela de teste carregada');
    addLog('🌐 Testando conectividade...');
  }, []);

  const testRegister = async () => {
    try {
      addLog('📝 Iniciando teste de REGISTRO...');
      const userData = {
        username: `testuser_${Date.now()}`,  // ✅ Corrigido: username em vez de name
        email: `test_${Date.now()}@vibemap.com`,
        password: 'securepass123',
      };
      addLog(`📋 Dados: ${JSON.stringify(userData)}`);

      const response = await api.post('users/register/', userData);
      addLog(`✅ REGISTRO SUCESSO: ${JSON.stringify(response.data)}`);
      Alert.alert('Sucesso', 'Registro funcionou!');
    } catch (error) {
      addLog(`❌ REGISTRO ERRO: ${error.message}`);
      addLog(`Status: ${error.response?.status}`);
      addLog(`Data: ${JSON.stringify(error.response?.data)}`);
      Alert.alert('Erro', `Registro failed: ${error.message}`);
    }
  };

  const testLogin = async () => {
    try {
      addLog('🔑 Iniciando teste de LOGIN...');
      const loginData = {
        email: 'test@vibemap.com',
        password: 'securepass123',
      };
      addLog(`📋 Dados: ${JSON.stringify(loginData)}`);

      const response = await api.post('users/login/', loginData);
      addLog(`✅ LOGIN SUCESSO`);
      addLog(`Token: ${response.data.access?.substring(0, 20)}...`);
      Alert.alert('Sucesso', 'Login funcionou!');
    } catch (error) {
      addLog(`❌ LOGIN ERRO: ${error.message}`);
      addLog(`Status: ${error.response?.status}`);
      addLog(`Data: ${JSON.stringify(error.response?.data)}`);
      Alert.alert('Erro', `Login failed: ${error.message}`);
    }
  };

  const testHealth = async () => {
    try {
      addLog('❤️ Testando health check...');
      const response = await api.get('users/');  // ✅ Adicionado prefixo users/
      addLog(`✅ Health check OK`);
    } catch (error) {
      addLog(`⚠️ Health check retornou: ${error.response?.status || error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧪 API Test Console</Text>

      <View style={styles.buttonContainer}>
        <Button title="Testar Registro" onPress={testRegister} color="#4CAF50" />
        <Button title="Testar Login" onPress={testLogin} color="#2196F3" />
        <Button title="Testar Health" onPress={testHealth} color="#FF9800" />
      </View>

      <ScrollView style={styles.logsContainer}>
        {logs.map((log, index) => (
          <Text key={index} style={styles.log}>
            {log}
          </Text>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    padding: 16,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    gap: 8,
  },
  logsContainer: {
    flex: 1,
    backgroundColor: '#000',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  log: {
    color: '#0f0',
    fontSize: 12,
    fontFamily: 'monospace',
    marginBottom: 4,
  },
});

export default APITestScreen;
