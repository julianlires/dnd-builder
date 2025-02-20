import { NextResponse } from 'next/server';
import { eryndor } from '@/character_example_responses/eryndor';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const characterCreatorModel: string = process.env.CHARACTER_CREATOR_MODEL || 'gpt-4o';

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();
    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    if (process.env.NODE_ENV === 'development' && process.env.USE_EXAMPLE_CHARACTERS === 'true') {
      return NextResponse.json(eryndor);
    }

    const completion = await openai.chat.completions.create({
      model: characterCreatorModel,
      messages: [
        {
          role: "system",
          content: "You are a D&D character creator. Generate character details in a structured JSON format."
        },
        {
          role: "user",
          content: `Create a D&D character based on this description: ${prompt}`
        }
      ],
      temperature: 0.7,
    });

    const parseCharacterResponse = (response: string) => {
      try {
        // Remove markdown code block and escape characters
        const cleanJson = response
          .replace(/```json\n/, '')  // Remove starting code block
          .replace(/\n```$/, '')     // Remove ending code block
          .replace(/\\n/g, '')       // Remove \n escape characters

        // Parse the cleaned JSON
        const character = JSON.parse(cleanJson)['character'];
        return character;
      } catch (error) {
        console.error('Error parsing character JSON:', error);
        throw new Error('Failed to parse character data');
      }
    }

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      return NextResponse.json(
        { error: 'No response from AI' },
        { status: 500 }
      );
    }

    const character = parseCharacterResponse(response);
    return NextResponse.json(character);
  } catch (error) {
    console.error('Error in generate-character route:', error);
    return NextResponse.json(
      { error: 'Failed to generate character' },
      { status: 500 }
    );
  }
}
