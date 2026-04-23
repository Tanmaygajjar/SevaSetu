import { NextResponse } from 'next/server';
import { translateText } from '@/lib/ai/sarvam';

export async function POST(request: Request) {
  try {
    const { text, source_language, target_language } = await request.json();

    if (!text || !source_language || !target_language) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const translatedText = await translateText(text, source_language, target_language);

    if (!translatedText) {
      return NextResponse.json({ error: 'Translation failed' }, { status: 500 });
    }

    return NextResponse.json({ translatedText });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
