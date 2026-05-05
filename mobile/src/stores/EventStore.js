import { makeAutoObservable } from 'mobx';
import EventService from '../services/events';
import EventTypeService from '../services/eventTypes';

class EventStore {
  events = [];
  eventTypes = [];
  loading = false;
  loadingTypes = false;
  error = null;

  constructor() {
    makeAutoObservable(this);
  }

  /**
   * Buscar tipos de eventos
   */
  async fetchEventTypes() {
    this.loadingTypes = true;
    this.error = null;

    try {
      const types = await EventTypeService.getEventTypes();
      this.eventTypes = types;
      return types;
    } catch (error) {
      this.error = error.message;
      console.error('Erro ao buscar tipos de eventos:', error);
      throw error;
    } finally {
      this.loadingTypes = false;
    }
  }

  /**
   * Buscar eventos próximos com base em coordenadas
   */
  async fetchNearbyEvents(latitude, longitude, radius = 5000) {
    this.loading = true;
    this.error = null;

    try {
      const nearbyEvents = await EventService.getNearbyEvents(latitude, longitude, radius);
      this.events = nearbyEvents;
      return nearbyEvents;
    } catch (error) {
      this.error = error.message;
      console.error('Erro ao buscar eventos próximos:', error);
      throw error;
    } finally {
      this.loading = false;
    }
  }

  /**
   * Criar um novo evento
   */
  async createEvent(eventData) {
    this.loading = true;
    this.error = null;

    try {
      const newEvent = await EventService.createEvent(eventData);
      this.events.push(newEvent);
      return newEvent;
    } catch (error) {
      this.error = error.message;
      console.error('Erro ao criar evento:', error);
      throw error;
    } finally {
      this.loading = false;
    }
  }



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
}

// Singleton instance
export const eventStore = new EventStore();
