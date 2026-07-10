import { useMemo } from 'react';

import { eventStore } from './EventStore';
import { userStore as userStoreSingleton } from './userStore';

export default function useStore() {
  return useMemo(
    () => ({
      userStore: userStoreSingleton,
      eventStore,
    }),
    [],
  );
}