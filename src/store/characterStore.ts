import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CharacterData } from '@/features/character/types';
import { devtools } from 'zustand/middleware';

interface CharacterStore {
  characters: Record<string, CharacterData>;
  activeCharacterId: string | null;
  setActiveCharacter: (id: string) => void;
  addCharacter: (character: CharacterData) => Promise<string>;
  updateCharacter: (id: string, updates: Partial<CharacterData>) => Promise<void>;
  deleteCharacter: (id: string) => Promise<void>;
  fetchCharacter: (id: string) => Promise<void>;
}

export const useCharacterStore = create<CharacterStore>()(
  devtools(
    persist(
      (set, get) => ({
        characters: {},
        activeCharacterId: null,

        setActiveCharacter: (id) =>
          set({ activeCharacterId: id }),

        addCharacter: async (character) => {
          try {
            const response = await fetch('/api/characters', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(character),
            });

            if (!response.ok) {
              throw new Error('Failed to save character');
            }

            const { id } = await response.json();

            set((state) => ({
              characters: {
                ...state.characters,
                [id]: character
              },
              activeCharacterId: id
            }));

            return id;
          } catch (error) {
            console.error('Error adding character:', error);
            throw error;
          }
        },

        updateCharacter: async (id, updates) => {
          try {
            const response = await fetch(`/api/characters/${id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(updates),
            });

            if (!response.ok) {
              throw new Error('Failed to update character');
            }

            set((state) => ({
              characters: {
                ...state.characters,
                [id]: { ...state.characters[id], ...updates }
              }
            }));
          } catch (error) {
            console.error('Error updating character:', error);
            throw error;
          }
        },

        deleteCharacter: async (id) => {
          try {
            const response = await fetch(`/api/characters/${id}`, {
              method: 'DELETE',
            });

            if (!response.ok) {
              throw new Error('Failed to delete character');
            }

            set((state) => {
              const { [id]: _, ...rest } = state.characters;
              return {
                characters: rest,
                activeCharacterId: state.activeCharacterId === id ? null : state.activeCharacterId
              };
            });
          } catch (error) {
            console.error('Error deleting character:', error);
            throw error;
          }
        },

        fetchCharacter: async (id) => {
          try {
            const response = await fetch(`/api/characters/${id}`);

            if (!response.ok) {
              throw new Error('Failed to fetch character');
            }

            const character = await response.json();

            set((state) => ({
              characters: {
                ...state.characters,
                [id]: character
              }
            }));
          } catch (error) {
            console.error('Error fetching character:', error);
            throw error;
          }
        },
      }),
      {
        name: 'character-storage'
      }
    )
  )
);
