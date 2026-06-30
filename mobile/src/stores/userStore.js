import { makeAutoObservable, flow } from 'mobx';
import AuthService from '../services/auth';

class UserStore {
  userProfile = null;
  loading = false;
  error = null;

  constructor() {
    makeAutoObservable(this);
  }

  /**
   * Buscar perfil do usuário logado (com flow para async)
   */
  fetchUserProfile = flow(function* () {
    this.loading = true;
    this.error = null;

    try {
        const user = yield AuthService.getUser();
        this.userProfile = user;
        return user;
        } catch (error) {
        this.error = error.message;
        console.error('Erro ao buscar perfil do usuário:', error);
        throw error;
    } finally {
        this.loading = false;
    }
  });
}