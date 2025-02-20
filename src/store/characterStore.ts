import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CharacterData } from '@/features/character/types';
import { generateCharacter } from '@/features/character/services/characterGeneration';
import { devtools } from 'zustand/middleware';
import { baseCharacterData } from '../features/character/constants/baseCharacterData';

interface CharacterStore {
  characters: Record<string, CharacterData>;
  activeCharacterId: string | null;
  setActiveCharacter: (id: string) => void;
  addCharacter: (character: CharacterData) => string;
  updateCharacter: (id: string, updates: Partial<CharacterData>) => void;
  deleteCharacter: (id: string) => void;
  generateFromPrompt: (prompt: string) => Promise<string>;
}

export const useCharacterStore = create<CharacterStore>()(
  devtools(
    persist(
      (set) => ({
        characters: {},
        activeCharacterId: null,

        setActiveCharacter: (id) =>
          set({ activeCharacterId: id }),

        addCharacter: (character) => {
          const id = crypto.randomUUID();
          set((state) => ({
            characters: {
              ...state.characters,
              [id]: character
            },
            activeCharacterId: id
          }));
          return id;
        },

        updateCharacter: (id, updates) =>
          set((state) => ({
            characters: {
              ...state.characters,
              [id]: { ...state.characters[id], ...updates }
            }
          })),

        deleteCharacter: (id) =>
          set((state) => {
            const { [id]: _deleted, ...rest } = state.characters;
            console.log('Deleted character:', _deleted);
            return {
              characters: rest,
              activeCharacterId: state.activeCharacterId === id ? null : state.activeCharacterId
            };
          }),

        generateFromPrompt: async (prompt: string) => {
          try {
            const promptedCharacter = await generateCharacter(prompt);
            console.log('promptedCharacter', promptedCharacter);
            const generatedCharacter = {
              ...baseCharacterData,
              ...promptedCharacter
            };
            const id = crypto.randomUUID();
            set((state) => ({
              characters: {
                ...state.characters,
                [id]: generatedCharacter
              },
              activeCharacterId: id
            }));
            return id;
          } catch (error) {
            console.error('Failed to generate character:', error);
            throw error;
          }
        }
      }),
      {
        name: 'character-storage'
      }
    )
  )
);
