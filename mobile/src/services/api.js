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
  let url = 'http://0.0.0.0:8000/api';
  
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


// axios é uma biblioteca de cliente HTTP que facilita fazer requisições para o backend,
// lidar com erros, e configurar interceptors para adicionar tokens de autenticação automaticamente
const api = axios.create({
  baseURL: getApiUrl(),    // define a URL base para todas as requisições, que é a URL do backend
  timeout: 10000,         // se a resposta demorar mais de 10 segundos, a requisição é cancelada para evitar que o app fique travado esperando
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token JWT automaticamente
// ganchos que executam código antes de cada requisição ou resposta,
//  permitindo modificar a requisição ou resposta, 
// ou lidar com erros de forma centralizada
api.interceptors.request.use(
  async (config) => {
    try {
      const publicAuthPaths = [
        '/users/login/',
        '/users/register_user/',
        '/users/register/',
        '/users/token/refresh/',
      ];
      const requestUrl = config.url ?? '';
      const isPublicAuthRequest = publicAuthPaths.some((path) => requestUrl.includes(path));

      if (isPublicAuthRequest) {
        return config;
      }

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
    return config; // retorna a config modificada
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros
api.interceptors.response.use(
  // apenas para debug: loga todas as respostas da API, 
  // tanto sucesso quanto erro, para facilitar o desenvolvimento e a depuração
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