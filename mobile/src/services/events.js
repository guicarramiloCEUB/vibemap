import api from './api';

const EventService = {
  /**
   * Criar um novo evento
   * @param {Object} eventData - { title, description, location_name, latitude, longitude, event_type_id }
   * @returns {Promise<Object>} evento criado
   */
  async createEvent(eventData) {
    try {
      // Formatar dados para GeoJSON Point
      const payload = {
        title: eventData.title,
        description: eventData.description,
        location_name: eventData.location_name,
        location: {
          type: 'Point',
          coordinates: [eventData.longitude, eventData.latitude], // GeoJSON uses [lng, lat]
        },
        event_type_id: eventData.event_type_id || 1, // Default type
        starts_at: eventData.starts_at || new Date().toISOString(),
      };

      const response = await api.post('/events/criar_evento/', payload);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar evento:', error);
      throw error;
    }
  },


};

export default EventService;
