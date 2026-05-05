import api from './api';

const EventTypeService = {
  /**
   * Buscar todos os tipos de eventos
   * @returns {Promise<Array>} lista de tipos de eventos
   */
  async getEventTypes() {
    try {
      const response = await api.get('/events/listar_tipos_eventos/');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar tipos de eventos:', error);
      throw error;
    }
  },
};

export default EventTypeService;
