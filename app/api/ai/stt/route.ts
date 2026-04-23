import { NextResponse } from 'next/server';
import { speechToText } from '@/lib/ai/sarvam';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as Blob;
    const languageCode = formData.get('language_code') as string || 'hi-IN';

    if (!audioFile) {
      return NextResponse.json({ error: 'Audio file is required' }, { status: 400 });
    }

    const transcript = await speechToText(audioFile, languageCode);

    if (!transcript) {
      return NextResponse.json({ error: 'STT Conversion failed' }, { status: 500 });
    }

    return NextResponse.json({ transcript });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
