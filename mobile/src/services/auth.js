import * as SecureStore from 'expo-secure-store';
import api from './api';

/**
 * Serviço de autenticação com JWT
 * Gerencia login, logout e armazenamento de tokens
 */
const AuthService = {
  /**
   * Login com email e senha
   * @param {string} email
   * @param {string} password
   * @returns {Promise<{user: object, tokens: {access, refresh}}>}
   */
  login: async (email, password) => {
    try {
      console.log('🔐 Tentando login...');
      
      const response = await api.post('/users/login/', {
        email,
        password,
      });

      const { access, refresh } = response.data;

      console.log('✅ Login bem-sucedido!');
      console.log('💾 Salvando tokens...');

      // Salvar tokens no SecureStore
      await SecureStore.setItemAsync('access_token', access);
      await SecureStore.setItemAsync('refresh_token', refresh);

      return {
        success: true,
        tokens: { access, refresh },
      };
    } catch (error) {
      console.error('❌ Erro no login:', error);
      return {
        success: false,
        error: error.response?.data?.detail || error.message,
      };
    }
  },

  /**
   * Registrar novo usuário
   * @param {string} email
   * @param {string} username
   * @param {string} password
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  register: async (email, username, password) => {
    try {
      console.log('📝 Tentando registro...');

      const response = await api.post('/users/register/', {
        email,
        username,
        password,
      });

      console.log('✅ Registro bem-sucedido!');

      // Após registro, faz login automático
      return await AuthService.login(email, password);
    } catch (error) {
      console.error('❌ Erro no registro:', error);
      return {
        success: false,
        error: error.response?.data || error.message,
      };
    }
  },

  /**
   * Renovar access token usando refresh token
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  refreshToken: async () => {
    try {
      console.log('🔄 Renovando token...');

      const refreshToken = await SecureStore.getItemAsync('refresh_token');

      if (!refreshToken) {
        console.warn('⚠️  Refresh token não encontrado');
        return { success: false, error: 'Refresh token não encontrado' };
      }

      const response = await api.post('/users/token/refresh/', {
        refresh: refreshToken,
      });

      const { access } = response.data;

      console.log('✅ Token renovado!');
      console.log('💾 Salvando novo access token...');

      // Salvar novo access token
      await SecureStore.setItemAsync('access_token', access);

      return { success: true, access };
    } catch (error) {
      console.error('❌ Erro ao renovar token:', error);
      return {
        success: false,
        error: error.response?.data?.detail || error.message,
      };
    }
  },

  /**
   * Logout - remover tokens
   * @returns {Promise<void>}
   */
  logout: async () => {
    try {
      console.log('🔓 Fazendo logout...');

      await SecureStore.deleteItemAsync('access_token');
      await SecureStore.deleteItemAsync('refresh_token');

      console.log('✅ Logout bem-sucedido!');
      return { success: true };
    } catch (error) {
      console.error('❌ Erro no logout:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Buscar token armazenado
   * @returns {Promise<string|null>}
   */
  getAccessToken: async () => {
    try {
      const token = await SecureStore.getItemAsync('access_token');
      return token;
    } catch (error) {
      console.error('❌ Erro ao buscar token:', error);
      return null;
    }
  },

  /**
   * Verificar se usuário está autenticado
   * @returns {Promise<boolean>}
   */
  isAuthenticated: async () => {
    const token = await AuthService.getAccessToken();
    return !!token;
  },

  /**
   * Limpar todos os dados de autenticação
   * @returns {Promise<void>}
   */
  clearAuth: async () => {
    try {
      await SecureStore.deleteItemAsync('access_token');
      await SecureStore.deleteItemAsync('refresh_token');
      console.log('✅ Dados de autenticação removidos');
    } catch (error) {
      console.error('❌ Erro ao limpar auth:', error);
    }
  },
};

export default AuthService;
