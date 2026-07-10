import * as SecureStore from 'expo-secure-store';
// secure store é uma biblioteca do expo que permite armazenar dados 
// de forma segura no dispositivo, como tokens de autenticação, 
// usando criptografia nativa do sistema operacional

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
      /* tenta fazer login com as credenciais */
      const response = await api.post('/users/login/', {
        email,
        password,
      });

      /* para login, o django esta usando JWT, que retorna os tokens caso as credenciais sejam válidas */
      const { access, refresh } = response.data;

      console.log('✅ Login bem-sucedido!');
      console.log('💾 Salvando tokens...');

      // Salvar tokens no SecureStore
      await SecureStore.setItemAsync('access_token', access);
      await SecureStore.setItemAsync('refresh_token', refresh);
      
      // incluindo os tokens por enquanto, mas futuramente pode ser 
      // interessante retornar o usuário logado também, 
      // para mostrar o nome dele na tela principal do app
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


      // tenta registrar o usuário com as credenciais fornecidas, usando a rota de registro do backend
      const response = await api.post('/users/register_user/', {
        email,
        username,
        password,
      });

      console.log('✅ Registro bem-sucedido!');

      // Após registro, faz login automático retornando login sucesso
      return await AuthService.login(email, password);
    } catch (error) { 
      // se houver erro de login ou registro, 
      // loga o erro e retorna um objeto com success false e a mensagem de erro
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
      // Busca o refresh token do SecureStore
      const refreshToken = await SecureStore.getItemAsync('refresh_token');

      if (!refreshToken) {
        console.warn('⚠️  Refresh token não encontrado');
        return { success: false, error: 'Refresh token não encontrado' };
      }


      // Faz uma requisição para a rota de renovação de token do backend, passando o refresh token
      const response = await api.post('/users/token/refresh/', {
        refresh: refreshToken,
      });

      // retonrna novo access token
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
      
      // Remove os tokens do SecureStore para efetuar logout
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
      // metodo para buscar o access token do SecureStore, 
      // usado para verificar se o usuário está autenticado 
      // e para adicionar o token no header das requisições

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
    // metodo de checagem de autenticação, que verifica 
    // se existe um access token válido armazenado.
    const token = await AuthService.getAccessToken();
    return !!token;
  },

  /**
   * Limpar todos os dados de autenticação
   * @returns {Promise<void>}
   */
  clearAuth: async () => {
    try {
      // limpa os tokens do SecureStore, usado para garantir que 
      // o usuário seja completamente deslogado,
      await SecureStore.deleteItemAsync('access_token');
      await SecureStore.deleteItemAsync('refresh_token');
      console.log('✅ Dados de autenticação removidos');
    } catch (error) {
      console.error('❌ Erro ao limpar auth:', error);
    }
  },

  getUser: async () => {
    try {
      // metodo para buscar o usuário logado, 
      // usando o access token para autenticar a requisição
      const token = await AuthService.getAccessToken();
      if (!token) {
        console.warn('⚠️  Nenhum token encontrado');
        return null;
      }

      const response = await api.get('/users/me/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error('❌ Erro ao buscar usuário:', error);
      return null;
    }
  },

  updateUser: async (updatedData) => {
    try {
      // metodo para atualizar o usuário logado, 
      // usando o access token para autenticar a requisição
      const token = await AuthService.getAccessToken();
      if (!token) {
        console.warn('⚠️  Nenhum token encontrado');
        return null;
      }

      const response = await api.put('/users/update_user/', updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error('❌ Erro ao atualizar usuário:', error);
      return null;
    }
  }
};

export default AuthService;
