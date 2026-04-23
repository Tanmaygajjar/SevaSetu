import { NextResponse } from 'next/server';
import { textToSpeech } from '@/lib/ai/sarvam';

export async function POST(request: Request) {
  try {
    const { text, language_code, speaker } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const audioBase64 = await textToSpeech(text, {
      target_language_code: language_code || 'hi-IN',
      speaker: speaker || 'meera'
    });

    if (!audioBase64) {
      return NextResponse.json({ error: 'TTS Conversion failed' }, { status: 500 });
    }

    return NextResponse.json({ audio: audioBase64 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
