'use client';

import { useCharacterStore } from '@/app/store/characterStore';

export default function Sidebar() {
  const {
    characters,
    activeCharacterId,
    setActiveCharacter,
    deleteCharacter,
    generateFromPrompt
  } = useCharacterStore();

  return (
    <aside className="w-64 bg-gray-800 text-white p-4 h-screen">
      <button
        type="button"
        className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
        onClick={async () => {
          try {
            const prompt = window.prompt('Describe your character:');
            if (!prompt) return;
            await generateFromPrompt(prompt);
          } catch {
            alert('Failed to generate character. Please try again.');
          }
        }}
      >
        Generate Character
      </button>

      <div className="space-y-2">
        {Object.entries(characters).map(([id, character]) => (
          <div
            key={id}
            className={`p-3 rounded cursor-pointer transition-colors ${
              id === activeCharacterId
                ? 'bg-gray-600'
                : 'hover:bg-gray-700'
            }`}
            onClick={() => setActiveCharacter(id)}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold">{character.name || 'Unnamed Character'}</h3>
                <p className="text-sm text-gray-400">{character.classLevel}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm('Are you sure you want to delete this character?')) {
                    deleteCharacter(id);
                  }
                }}
                className="text-red-500 hover:text-red-400"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
