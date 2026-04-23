const SARVAM_BASE_URL = 'https://api.sarvam.ai';

async function sarvamFetch(endpoint: string, body: Record<string, unknown>) {
  const apiKey = process.env.SARVAM_API_KEY;
  if (!apiKey) {
    throw new Error('SARVAM_API_KEY not configured');
  }

  const response = await fetch(`${SARVAM_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-subscription-key': apiKey,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Sarvam API error: ${response.status}`);
  }

  return response.json();
}

export async function detectLanguage(text: string): Promise<{ languageCode: string; confidence: number }> {
  try {
    const result = await sarvamFetch('/translate/detect-language', { text });
    return {
      languageCode: result.language_code || 'en',
      confidence: result.confidence || 0.5,
    };
  } catch {
    return { languageCode: 'en', confidence: 0.5 };
  }
}

export async function translateText(
  text: string,
  sourceLang: string,
  targetLang: string
): Promise<string> {
  try {
    const result = await sarvamFetch('/translate', {
      input: text,
      source_language_code: sourceLang,
      target_language_code: targetLang,
      mode: 'formal',
    });
    return result.translated_text || text;
  } catch {
    return text;
  }
}

export async function transliterate(
  text: string,
  sourceLang: string,
  targetLang: string
): Promise<string> {
  try {
    const result = await sarvamFetch('/transliterate', {
      input: text,
      source_language_code: sourceLang,
      target_language_code: targetLang,
    });
    return result.transliterated_text || text;
  } catch {
    return text;
  }
}

export async function speechToText(
  audioBuffer: Buffer,
  languageCode: string
): Promise<{ transcript: string; detectedLang: string }> {
  try {
    const apiKey = process.env.SARVAM_API_KEY;
    if (!apiKey) throw new Error('SARVAM_API_KEY not configured');

    const formData = new FormData();
    formData.append('file', new Blob([new Uint8Array(audioBuffer)]), 'audio.wav');
    formData.append('language_code', languageCode);

    const response = await fetch(`${SARVAM_BASE_URL}/speech-to-text`, {
      method: 'POST',
      headers: { 'api-subscription-key': apiKey },
      body: formData,
    });

    if (!response.ok) throw new Error(`STT error: ${response.status}`);
    const result = await response.json();
    return {
      transcript: result.transcript || '',
      detectedLang: result.language_code || languageCode,
    };
  } catch {
    return { transcript: '', detectedLang: languageCode };
  }
}
