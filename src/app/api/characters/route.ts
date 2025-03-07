import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { CharacterData } from '@/features/character/types';

export async function POST(request: Request) {
  try {
    const character: CharacterData = await request.json();
    const charactersRef = collection(db, 'characters');
    const docRef = await addDoc(charactersRef, character);

    return NextResponse.json({
      id: docRef.id,
      success: true
    });
  } catch (error) {
    console.error('Error creating character:', error);
    return NextResponse.json(
      { error: 'Failed to create character' },
      { status: 500 }
    );
  }
}
