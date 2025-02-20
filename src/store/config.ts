import { StateCreator, StoreMutatorIdentifier } from 'zustand';

// Define middleware types
export type StoreMiddleware<T> = (
  config: StateCreator<T, [], []>
) => StateCreator<T, [], []>;

// Type for creating a store with middlewares
export type CreateWithMiddleware<T> = <
  Mos extends [StoreMutatorIdentifier, unknown][] = []
>(
  initializer: StateCreator<T, [], Mos>
) => StateCreator<T, [], Mos>;

// Helper type for persisted state
export type PersistedState<T> = {
  state: T;
  version: number;
};

// Configuration constants
export const STORE_VERSION = 1;
export const STORAGE_PREFIX = 'app';

// Storage configuration
export const storageConfig = {
  name: `${STORAGE_PREFIX}-storage`,
  version: STORE_VERSION,
  // Add any other storage configuration options here
};
