import axios from 'axios';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

// Detectar o ambiente e ajustar a URL
// Android Emulator: 10.0.2.2 (gateway para o host)
// iOS Simulator: localhost
// Device físico: IP da máquina (ex: 192.168.1.100)

const getApiUrl = () => {
  const localDebug = Constants.expoConfig?.extra?.apiUrl;
  
  // Em produção
  if (__DEV__ === false) {
    return 'https://api.vibemap.com/api';
  }
  
  // Em desenvolvimento
  let url = 'http://10.0.2.2:8000/api';
  
  // Se for iOS ou mobile físico, tentar usar o IP local
  if (Platform.OS === 'ios') {
    url = 'http://localhost:8000/api';
  } else if (Platform.OS === 'android') {
    // Para Android Emulator, tentar com IP da máquina host
    // ALTERAR para o IP da sua máquina (descubra com: hostname -I)
    url = 'http://192.168.15.101:8000/api';
  }
  
  console.log('🌐 API URL:', url);
  console.log('📱 Platform:', Platform.OS);
  console.log('🔧 DEV Mode:', __DEV__);
  
  return url;
};

const api = axios.create({
  baseURL: getApiUrl(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token JWT automaticamente
api.interceptors.request.use(
  async (config) => {
    try {
      // Buscar token do SecureStore
      const token = await SecureStore.getItemAsync('access_token');
      
      if (token) {
        // Adicionar token no header Authorization
        config.headers.Authorization = `Bearer ${token}`;
        console.log('🔐 Token adicionado ao header');
      } else {
        console.log('⚠️  Nenhum token encontrado');
      }
    } catch (error) {
      console.error('❌ Erro ao buscar token:', error);
    }
    
    console.log('📤 API Request:', config.method.toUpperCase(), config.url);
    console.log('📦 Data:', config.data);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('❌ API Error Status:', error.response?.status);
    console.error('❌ API Error Data:', error.response?.data);
    console.error('❌ API Error Message:', error.message);
    console.error('❌ Full Error:', JSON.stringify(error, null, 2));
    return Promise.reject(error);
  }
);

export default api;