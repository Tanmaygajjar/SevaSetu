import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File | Blob | null;
    const languageCode = formData.get('language_code') as string || 'hi-IN';

    if (!audioFile) {
      return NextResponse.json({ error: 'Audio file is required' }, { status: 400 });
    }

    const apiKey = process.env.SARVAM_API_KEY;
    if (!apiKey) {
      console.error('SARVAM_API_KEY is not configured');
      return NextResponse.json({ error: 'Sarvam API key not configured' }, { status: 500 });
    }

    // Log audio details for debugging
    console.log('STT Request:', {
      audioSize: audioFile.size,
      audioType: audioFile.type,
      languageCode,
      apiKeyPresent: !!apiKey,
      apiKeyPrefix: apiKey.substring(0, 8) + '...'
    });

    // Build FormData for Sarvam API directly
    const sarvamForm = new FormData();
    sarvamForm.append('file', audioFile, 'recording.webm');
    sarvamForm.append('language_code', languageCode || 'unknown');
    sarvamForm.append('model', 'saaras:v3');
    sarvamForm.append('mode', 'transcribe');

    const response = await fetch('https://api.sarvam.ai/speech-to-text', {
      method: 'POST',
      headers: {
        'api-subscription-key': apiKey,
      },
      body: sarvamForm,
    });

    const responseText = await response.text();
    console.log('Sarvam STT Response:', response.status, responseText);

    if (!response.ok) {
      return NextResponse.json(
        { error: `Sarvam API error: ${response.status} - ${responseText}` },
        { status: 500 }
      );
    }

    const data = JSON.parse(responseText);

    if (!data.transcript) {
      return NextResponse.json(
        { error: 'No transcript returned from Sarvam API', details: data },
        { status: 500 }
      );
    }

    return NextResponse.json({ transcript: data.transcript });
  } catch (error: any) {
    console.error('STT Route Error:', error);
    return NextResponse.json({ error: error.message || 'Unknown error' }, { status: 500 });
  }
}
