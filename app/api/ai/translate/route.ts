import { NextResponse } from 'next/server';
import { translateText, translateBulk } from '@/lib/ai/sarvam';

export async function POST(request: Request) {
  try {
    const { text, source_language, target_language } = await request.json();

    if (!text || !source_language || !target_language) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (Array.isArray(text)) {
      const translatedTexts = await translateBulk(text, source_language, target_language);
      return NextResponse.json({ translatedTexts });
    } else {
      const translatedText = await translateText(text, source_language, target_language);
      if (!translatedText) {
        return NextResponse.json({ error: 'Translation failed' }, { status: 500 });
      }
      return NextResponse.json({ translatedText });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
