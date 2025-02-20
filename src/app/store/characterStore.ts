import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CharacterData } from '@/app/types/character';
import { generateCharacter } from '@/app/services/characterGeneration';
import { initialCharacterData } from '@/app/data/initialCharacterData';
import { devtools } from 'zustand/middleware';

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
      (set, get) => ({
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
              ...initialCharacterData,
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
