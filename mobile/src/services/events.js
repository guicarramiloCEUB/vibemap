import api from './api';

const EventService = {
  /**
   * Criar um novo evento
   * @param {Object} eventData - { title, description, latitude, longitude, event_type_id }
   * @returns {Promise<Object>} evento criado
   */
  async createEvent(eventData) {
    try {
      // Formatar dados para GeoJSON Point
      const payload = {
        title: eventData.title,
        description: eventData.description,
        location: {
          type: 'Point',
          coordinates: [eventData.longitude, eventData.latitude], // GeoJSON uses [lng, lat]
        },
        event_type: eventData.event_type_id ,
        // starts_at é preenchido automaticamente no backend com timezone.now()
      };

      const response = await api.post('/events/criar_evento/', payload);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar evento:', error);
      throw error;
    }
  },

  /**
   * Buscar eventos próximos com base em coordenadas
   * @param {Number} latitude - Latitude do usuário
   * @param {Number} longitude - Longitude do usuário
   * @param {Number} radius - Raio em metros (default 5000m = 5km)
   * @returns {Promise<Array>} lista de eventos próximos
   */
  async getNearbyEvents(latitude, longitude, radius = 5000) {
    try {
      const response = await api.get('/events/nearby/', {
        params: {
          lat: latitude,
          lng: longitude,
          radius: radius,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar eventos próximos:', error);
      throw error;
    }
  },
};

export default EventService;
