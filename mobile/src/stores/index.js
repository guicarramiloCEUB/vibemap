/**
 * Store exports and singleton instances
 *
 * This module aggregates all application stores and provides singleton instances
 * for use throughout the application.
 */

export { default as UserStore, userStore } from './userStore';
export { default as EventStore, eventStore } from './EventStore';

export { default as useStore } from './useStore';