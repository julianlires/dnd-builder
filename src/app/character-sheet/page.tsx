'use client';

import CharacterSheet from '../components/CharacterSheet';
import Sidebar from '../components/Sidebar';
import { useCharacterStore } from '@/app/store/characterStore';

export default function CharacterSheetPage() {
  const { characters, activeCharacterId, updateCharacter } = useCharacterStore();
  const activeCharacter = activeCharacterId ? characters[activeCharacterId] : null;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 bg-gray-100 p-8">
        {activeCharacter ? (
          <CharacterSheet
            character={activeCharacter}
            setCharacter={(characterData) => updateCharacter(activeCharacterId!, characterData)}
          />
        ) : (
          <div className="text-center text-gray-500 mt-8">
            Select a character or generate a new one to begin
          </div>
        )}
      </main>
    </div>
  );
}
