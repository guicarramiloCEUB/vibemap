import { makeAutoObservable, flow } from 'mobx';
import EventService from '../services/events';
import EventTypeService from '../services/eventTypes';

class EventStore {
  events = [];
  eventTypes = [];
  pendingEvents = [];
  loading = false;
  loadingTypes = false;
  error = null;

  constructor() {
    makeAutoObservable(this);
  }

  /**
   * Buscar tipos de eventos (com flow para async)
   */
  fetchEventTypes = flow(function* () {
    this.loadingTypes = true;
    this.error = null;

    try {
      const types = yield EventTypeService.getEventTypes();
      this.eventTypes = types;
      return types;
    } catch (error) {
      this.error = error.message;
      console.error('Erro ao buscar tipos de eventos:', error);
      throw error;
    } finally {
      this.loadingTypes = false;
    }
  });

  /**
   * Buscar eventos próximos com base em coordenadas (com flow para async)
   */
  fetchNearbyEvents = flow(function* (latitude, longitude, radius = 5000) {
    this.loading = true;
    this.error = null;

    try {
      const nearbyEvents = yield EventService.getNearbyEvents(latitude, longitude, radius);
      this.events = nearbyEvents;
      return nearbyEvents;
    } catch (error) {
      this.error = error.message;
      console.error('Erro ao buscar eventos próximos:', error);
      throw error;
    } finally {
      this.loading = false;
    }
  });

  /**
   * Criar um novo evento (com flow para async)
   */
  createEvent = flow(function* (eventData) {
    this.loading = true;
    this.error = null;

    try {
      const newEvent = yield EventService.createEvent(eventData);
      this.events.push(newEvent);
      return newEvent;
    } catch (error) {
      this.error = error.message;
      console.error('Erro ao criar evento:', error);
      throw error;
    } finally {
      this.loading = false;
    }
  });



  /**
   * Adicionar evento à lista (para otimismo)
   */
  addEventOptimistically(event) {
    this.events.push(event);
  }

  /**
   * Limpar erro
   */
  clearError() {
    this.error = null;
  }

  /**
   * Getter: quantidade de eventos
   */
  get eventCount() {
    return this.events.length;
  }

  /**
   * Getter: todos os eventos
   */
  get allEvents() {
    return this.events;
  }

  addRealtimeEvent(newEvent) {
    const exists = this.events.find(e => e.id === newEvent.id);
    if (!exists) {
      this.events.push(newEvent);
    }
  }

  addPendingEvent(event) {
    const exists = this.pendingEvents.find(e => e.id === event.id);
    if (!exists) {
      this.pendingEvents.push(event);
    }
  }

  removePendingEvent(eventId) {
    this.pendingEvents = this.pendingEvents.filter(e => e.id !== eventId);
  }

  voteOnEvent = flow(function* (eventId, isConfirmed) {
    try {
      // 1. Remove da fila local imediatamente para fechar o popup na tela (Optimistic UI)
      this.removePendingEvent(eventId);

      // 2. Chama o serviço que faz a requisição para o backend
      const response = yield EventService.voteEvent(eventId, isConfirmed);
      return response;
    } catch (error) {
      console.error('Erro ao votar no evento:', error);
      // Se a API falhar, você pode optar por devolver o evento para a fila aqui
      throw error;
    }
  });

  fetchPendingNearbyEvents = flow(function* (latitude, longitude, radius = 5000) {
    try {
      const pendingEvents = yield EventService.getPendingNearbyEvents(latitude, longitude, radius);

      // Substitui a lista atual pelos pendentes que vieram do banco
      this.pendingEvents = pendingEvents; 
      return pendingEvents;
    } catch (error) {
      console.error('Erro ao buscar eventos pendentes na inicialização:', error);
    }
  });
}

// Singleton instance
export default EventStore;
export const eventStore = new EventStore();
