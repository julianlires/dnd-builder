import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'Character ID is required' },
        { status: 400 }
      );
    }

    const characterRef = doc(db, 'characters', id);
    const characterSnap = await getDoc(characterRef);

    if (!characterSnap.exists()) {
      return NextResponse.json(
        { error: 'Character not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: characterSnap.id,
      ...characterSnap.data()
    });
  } catch (error) {
    console.error('Error fetching character:', error);
    return NextResponse.json(
      { error: 'Failed to fetch character' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const updates = await request.json();
    const characterRef = doc(db, 'characters', id);
    await updateDoc(characterRef, updates);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating character:', error);
    return NextResponse.json(
      { error: 'Failed to update character' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const characterRef = doc(db, 'characters', id);
    await deleteDoc(characterRef);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting character:', error);
    return NextResponse.json(
      { error: 'Failed to delete character' },
      { status: 500 }
    );
  }
}
