import { CharacterData } from '@/app/types/character';

export async function generateCharacter(prompt: string): Promise<CharacterData> {
  const response = await fetch('/api/generate-character', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate character');
  }

  return response.json();
}
